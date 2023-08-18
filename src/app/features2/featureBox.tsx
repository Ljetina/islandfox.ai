import { StaticChatMessage } from './StaticChatMessage';

import { loadDemoConversation } from '@/lib/db';

export async function FeaturesBox() {
  const messages = await loadDemoConversation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="w-full max-w-2xl mx-auto overflow-hidden dark shadow-2xl rounded-lg"
        style={{ marginTop: '105px', marginBottom: '100px' }}
      > 
        {messages.map((message, index) => {
          return <StaticChatMessage key={message.id} message={message} />;
        })}
      </div>
    </div>
  );
}
