import { ChatBody } from '@/types/chat';

import { authOptions } from '@/lib/auth';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/lib/const';
import { OpenAIError, OpenAIStream } from '@/lib/stream';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, res: Response): Promise<Response> => {
  // @ts-ignore
  const session = await getServerSession(req, res, authOptions);

  try {
    const { model, messages, key, prompt, temperature } =
      (await req.json()) as ChatBody;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    const stream = await OpenAIStream(
      model,
      promptToSend,
      temperatureToUse,
      key,
      messages,
    );
    return new Response(stream);
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
