import { Conversation } from '@/types/chat';

import { ConversationComponent } from './Conversation';

interface Props {
  conversations: Conversation[];
}

export const Conversations = ({ conversations }: Props) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .filter((conversation) => !conversation.folder_id)
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
          />
        ))}
    </div>
  );
};
