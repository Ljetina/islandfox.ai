import { OpenAIModelID } from '@/types/openai';

import ChatHome from './ChatHome';

export default function ChatHomePage() {
  return (
    <ChatHome
      serverSideApiKeyIsSet={false}
      serverSidePluginKeysSet={false}
      defaultModelId={OpenAIModelID.GPT_3_5}
    />
  );
}
