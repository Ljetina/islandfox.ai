import { useCallback, useContext, useState } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { Conversations } from './components/Conversations';
import { NewConversationButton } from './components/NewConversationButton';

import { LoginButton } from '../Login/LoginButton';
import SettingDialog from '../Settings/GlobalSettings';
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

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const onOpen = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);
  const onClose = useCallback(() => {
    setSettingsOpen(false);
  }, [setSettingsOpen]);
  const onSave = useCallback(() => {}, []);

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
        <div className="flex flex-col gap-4 px-4 py-2">
          <button
            onClick={onOpen}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Settings
          </button>
          <LoginButton />
        </div>
      </div>
      <SettingDialog onClose={onClose} onSave={onSave} open={isSettingsOpen} />
    </Sidebar>
  );
};
