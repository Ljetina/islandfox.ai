import { useCallback, useContext, useEffect, useState } from 'react';

import { useEvent } from '@/hooks/useEvents';

import { Conversation } from '@/types/chat';

import { Conversations } from './components/Conversations';
import { CreditDisplay } from './components/CreditDisplay';
import { NewConversationButton } from './components/NewConversationButton';

import { Button } from '../Buttons/Button';
import { TopUpDialog } from '../Chat/TopupDialog';
import { LoginButton } from '../Login/LoginButton';
import SettingDialog from '../Settings/GlobalSettings';
import Sidebar from '../Sidebar/NewSidebar';

import { ChatContext } from '@/app/chat/chat.provider';
import { creditsToDollars } from '@/lib/billing';
import { trackEvent } from '@/hooks/useTrackPage';

export const Chatbar = () => {
  const {
    state: {
      conversations,
      uiShowConverations,
      remainingCredits,
      tenantId,
      email,
      isLoggedIn,
    },
    handleNewConversation,
    toggleShowConversation,
  } = useContext(ChatContext);

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isTopupOpen, setTopupOpen] = useState(false);

  const onOpen = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'open_jupyter_server_settings' });
    setSettingsOpen(true);
  }, [setSettingsOpen]);
  const onClose = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'close_jupyter_server_settings' });
    setSettingsOpen(false);
  }, [setSettingsOpen]);
  const onSave = useCallback(() => {}, []);

  const onCloseTopup = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'close_top-up' });
    setTopupOpen(false);
  }, []);

  const onOpenTopup = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'top-up' });
    setTopupOpen(true);
  }, []);

  const onTopUp = useCallback(() => {
    trackEvent({ action: 'event', category: 'conversion', label: 'top-up_complete' });
    setTopupOpen(false);
  }, []);
  useEvent('credit_topup', onTopUp);

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
      {isLoggedIn && (
        <div className="sticky top-0">
          <NewConversationButton onNewConversation={handleNewConversation} />
        </div>
      )}

      <div className="overflow-y-auto flex-grow">
        {isLoggedIn && (
          <Conversations conversations={conversations as Conversation[]} />
        )}
      </div>

      <div className="sticky bottom-0">
        <div className="flex flex-col gap-4 px-4 py-2">
          {isLoggedIn && (
            <Button onClick={onOpen}>
              {' '}
              <img
                src="/assets/img/logo/jupyter.png"
                height={45}
                width={45}
                alt="Jupyter Icon"
                className="inline-block mr-2"
              />
              Server Settings
            </Button>
          )}
          {isLoggedIn && (
            <CreditDisplay
              onClickTopUp={onOpenTopup}
              creditsInUsd={creditsToDollars(remainingCredits)}
            />
          )}
          {isLoggedIn && <LoginButton />}
        </div>
      </div>

      <SettingDialog onClose={onClose} onSave={onSave} open={isSettingsOpen} />
      {isTopupOpen && (
        <TopUpDialog
          tenantId={tenantId as string}
          email={email as string}
          onClose={onCloseTopup}
        />
      )}
    </Sidebar>
  );
};
