import { useCallback, useContext, useEffect, useState } from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useCreateReducer } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { Conversations } from './components/Conversations';
import { NewConversationButton } from './components/NewConversationButton';

import { BillingDialog } from '../Chat/BillingDialog';
import { LoginButton } from '../Login/LoginButton';
import SettingDialog from '../Settings/GlobalSettings';
import Sidebar from '../Sidebar/NewSidebar';
import { ChatbarInitialState, initialState } from './Chatbar.state';

import { ChatContext } from '@/app/chat/chat.provider';
import { creditsToDollars } from '@/lib/billing';
import { apiCreateConversation } from '@/lib/conversation';

export const Chatbar = () => {
  const {
    state: { conversations, uiShowConverations, remainingCredits },
    handleNewConversation,
    toggleShowConversation,
  } = useContext(ChatContext);

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isTopupOpen, setTopupOpen] = useState(false);
  const onOpen = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);
  const onClose = useCallback(() => {
    setSettingsOpen(false);
  }, [setSettingsOpen]);
  const onSave = useCallback(() => {}, []);

  const onCloseBilling = useCallback(() => {
    setTopupOpen(false);
  }, []);

  const onOpenBilling = useCallback(() => {
    setTopupOpen(true);
  }, []);

  // const { outOfCredits } = useChatter();

  useEffect(() => {
    if (remainingCredits < 0) {
      setTopupOpen(true);
    }
  }, [remainingCredits]);

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
        <CreditDisplay
          onClick={onOpenBilling}
          remainingCredits={creditsToDollars(remainingCredits)}
        />
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
      {isTopupOpen && <BillingDialog onClose={onCloseBilling} />}
    </Sidebar>
  );
};

function CreditDisplay({
  onClick,
  remainingCredits,
}: {
  onClick: () => void;
  remainingCredits: string;
}) {
  return (
    <div className="flex items-center bg-white shadow rounded-md p-4">
      <div className="text-sm text-gray-700 mr-4">
        Remaining credits:{' '}
        <span className="font-semibold">${remainingCredits}</span>
      </div>
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Top-Up
      </button>
    </div>
  );
}

// Usage:
