import { useCallback, useContext } from 'react';

import { Conversation } from '@/types/chat';

import { ConversationComponent } from './Conversation';

import { ChatContext } from '@/app/chat/chat.provider';
import { apiDeleteConversation } from '@/lib/conversation';

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
