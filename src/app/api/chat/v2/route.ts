import { ChatBody } from '@/types/chat';

import { authOptions } from '@/lib/auth';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/lib/const';
import { OpenAIError, OpenAIStream } from '@/lib/stream';
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';
import { PassthroughStream } from './passthroughStream';

// export const runtime = 'edge';

interface ChatBodyV2 {
  conversation_id?: string;
  message_content: string;
}

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


