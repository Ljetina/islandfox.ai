import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

interface FunctionConfig {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: {
      [key: string]: any;
    };
    required: string[];
  };
}

async function fetchAvailableFunctions(): Promise<FunctionConfig[]> {
  const response = await fetch(`${process.env.FUNC_URL}/functions`);
  const functions = await response.json();
  return functions;
}

async function requestCompletion({
  model,
  systemPrompt,
  temperature,
  key,
  messages,
  functions,
  decoder,
}: {
  model: OpenAIModel;
  systemPrompt: string;
  temperature: number;
  key: string;
  messages: Message[];
  functions: FunctionConfig[];
  decoder: TextDecoder;
}) {
  let url = `${process.env.FUNC_URL}/completions`;
  // let url = `${OPENAI_API_HOST}/v1/chat/completions`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      model: model.id,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: temperature,
      stream: true,
      functions,
    }),
  });

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }
  return res;
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature: number,
  key: string,
  messages: Message[],
) => {
  const functions = await fetchAvailableFunctions();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await requestCompletion({
    model,
    systemPrompt,
    temperature,
    key,
    messages,
    functions,
    decoder,
  });

  const functionAccumulator: {
    name?: string;
    arguments: string;
  } = {
    arguments: '',
  };

  let switchToFunctionHandling = false;
  let hasClosed = false;

  function closeIfDidnt(controller: ReadableStreamDefaultController) {
    if (!hasClosed) {
      controller.close();
      hasClosed = true;
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        // console.log(event);
        if (event.type === 'event') {
          const data = event.data;

          try {
            // This is the event which for some reason is returned after the function_call end. Returning here prevents parsing it as json down the line.
            if (data == '[DONE]') {
              // closeIfDidnt(controller);
              return;
            }
            const json = JSON.parse(data);
            // console.log(data)
            if (
              !switchToFunctionHandling &&
              Object.keys(json.choices[0]['delta']).includes('function_call')
            ) {
              switchToFunctionHandling = true;
            }
            // Default close case
            if (
              json.choices[0].finish_reason != null &&
              !switchToFunctionHandling
            ) {
              console.log('default close case', event);
              closeIfDidnt(controller);
              return;
            }
            // Default continue case
            else if (!switchToFunctionHandling) {
              console.log('default case', event);
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }

            // Function close case
            else if (
              json.choices[0].finish_reason != null &&
              switchToFunctionHandling
            ) {
              console.log('function close case', event);
              const functionName = functionAccumulator.name;
              const functionArgs = functionAccumulator.arguments;
              // Call the local function and wait for the result
              controller.enqueue(
                encoder.encode(
                  `Calling function ${functionName} (${functionArgs}) ... \n`,
                ),
              );
              callLocalFunction(functionName, JSON.parse(functionArgs))
                .then(async (response) => {
                  controller.enqueue(encoder.encode(JSON.stringify(response)));
                  controller.enqueue(encoder.encode('\n'));
                  // onFunctionCall(response);
                  messages.push({
                    role: 'assistant',
                    content: null,
                    function_call: {
                      name: functionName as string,
                      arguments: functionArgs,
                    },
                  });
                  messages.push({
                    role: 'function',
                    name: `${functionName}`,

                    content: `${JSON.stringify(response)}`,
                  });
                  console.log({ messages });
                  switchToFunctionHandling = false;
                  const postFunctionRes = await requestCompletion({
                    model,
                    systemPrompt,
                    key,
                    messages,
                    decoder,
                    functions,
                    temperature,
                  });
                  for await (const chunk of postFunctionRes.body as any) {
                    parser.feed(decoder.decode(chunk));
                  }
                })
                .catch((error) => {
                  console.error('Error calling function:', error);
                  closeIfDidnt(controller);
                });
            }

            // Function continue case
            else if (switchToFunctionHandling) {
              console.log('function continue case', event);
              const delta = json.choices[0].delta;
              if (delta.function_call) {
                const functionName = delta.function_call.name;
                const functionArgs = delta.function_call.arguments;
                if (functionName) {
                  functionAccumulator.name = functionName;
                }
                if (functionArgs) {
                  if (!functionAccumulator.arguments) {
                    functionAccumulator.arguments = '';
                  }
                  functionAccumulator.arguments += functionArgs;
                }
                console.log({ atDelta: functionAccumulator });
              }
            }
          } catch (e) {
            console.error(e);
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        const decoded = decoder.decode(chunk);
        parser.feed(decoded);
      }
    },
  });

  return stream;
};

// Replace this function with your actual implementation
async function callLocalFunction(
  functionName: string | undefined,
  functionArgs: object | undefined,
) {
  if (!functionName || !functionArgs) {
    console.log(
      'failed to parse function arguments or name',
      functionName,
      functionArgs,
    );
  }
  // Make a POST request to your local API at /functions/<function_name>
  const response = await fetch(
    `${process.env.FUNC_URL}/functions/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ args: functionArgs }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Extract the content from the response
  const json = await response.json();
  return json;
}
