import { useCallback, useContext, useState } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { Conversations } from './components/Conversations';
import { NewConversationButton } from './components/NewConversationButton';

import { LoginButton } from '../Login/LoginButton';
import Sidebar from '../Sidebar/NewSidebar';
import { ChatbarInitialState, initialState } from './Chatbar.state';

import { ChatContext } from '@/app/chat/chat.provider';
import { apiCreateConversation } from '@/lib/conversation';

export const Chatbar = () => {
  const {
    state: { conversations, uiShowConverations },
    handleNewConversation,
    toggleShowConversation,
  } = useContext(ChatContext);

  return (
    <Sidebar
      side={'left'}
      isOpen={uiShowConverations}
      toggleOpen={toggleShowConversation}
    >
      <div className="sticky top-0">
        <NewConversationButton onNewConversation={handleNewConversation} />
      </div>
      <div className="overflow-y-auto flex-grow">
        <Conversations conversations={conversations as Conversation[]} />
      </div>
      <div className="sticky bottom-0">
        <LoginButton />
      </div>
    </Sidebar>
  );
};
