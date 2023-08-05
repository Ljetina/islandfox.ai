import { ChatBody } from '@/types/chat';

import { authOptions } from '@/lib/auth';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/lib/const';
import { OpenAIError, OpenAIStream } from '@/lib/stream';
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export const config = {
  runtime: 'edge',
};

interface ChatBodyV2 {
  conversation_id?: string;
  message_content: string;
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const handler = async (req: Request, res: Response): Promise<Response> => {
  // @ts-ignore
  // const session = await getServerSession(req, res, authOptions);

  try {
    const { conversation_id, message_content } =
      (await req.json()) as ChatBodyV2;

    if (!conversation_id) {
      // Maybe another api call, move this out
      // let promptToSend = prompt;
      // if (!promptToSend) {
      //   promptToSend = DEFAULT_SYSTEM_PROMPT;
      // }
      // let temperatureToUse = temperature;
      // if (temperatureToUse == null) {
      //   temperatureToUse = DEFAULT_TEMPERATURE;
      // }
      // TODO create the conversation in the db
    }
    return new Response(
      await PassthroughStream(conversation_id as string, message_content), { headers: { 'Content-Type': 'text/event-stream' } }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export { handler as POST };

export const PassthroughStream = async (
  conversation_id: string,
  message: string,
) => {
  const url = 'http://127.0.0.1:8000/completions/v2'; // Replace with your actual server URL
  const body = {
    conversation_id,
    message: { content: message },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        try {
          if (event.type === 'event') {
            const data = event.data;
            const json = JSON.parse(data);
            if (data == '[DONE]') {
              controller.close();
              return;
            }
            if (json.choices[0].finish_reason != null) {
              controller.close();
              return;
            }
            console.log('enqueing');
            if ('content' in json.choices[0]['delta']) {
              const content = json.choices[0]['delta']['content'];
              if (content.length > 0) {
                const encoded = encoder.encode(`data: ${content}\n\n`);
                controller.enqueue(encoded);
              }
            }

            // const json = JSON.parse(data);
          }
        } catch (e) {
          console.log('error in func response to front-end mapping', e);
          controller.error(e);
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        const decoded = decoder.decode(chunk);
        console.log('writing chunk', decoded);
        parser.feed(decoded);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      // const reader = res.body?.getReader();
      // if (!reader) {
      //   console.log('reader is empty');
      //   return;
      // }

      // function push() {
      //   (reader as ReadableStreamDefaultReader<Uint8Array>)
      //     .read()
      //     .then(({ done, value }) => {
      //       if (done) {
      //         controller.close();
      //         return;
      //       }

      //       console.log({ value });
      //       const decoded = new TextDecoder().decode(value);
      //       const lines = decoded.split('\n');
      //       console.log({ lines });
      //       for (const l in lines) {
      //         if (l.startsWith('data: ')) {
      //           const payload = l.slice(6);
      //           const json = JSON.parse(payload);
      //           const text = json.choices[0].delta.content;
      //           controller.enqueue(encoder.encode('data: ' + text));
      //         }
      //       }
      //       push();
      //     })
      //     .catch((error) => {
      //       console.error('An error occurred:', error);
      //       controller.error(error);
      //     });

      // }

      // push();
    },
  });

  return stream;
};
