'use client';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Head from 'next/head';

import { Conversation } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { AccountDialog } from '@/components/Chat/AccountDialog';
import ActiveConversation from '@/components/Chat/ActiveConversation';
import { ActiveSettingsDialog } from '@/components/Chat/ActiveSettingsDialog';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import { Navbar } from '@/components/Mobile/Navbar';

import '../globals.css';
import { ChatContext } from './chat.provider';

import { getSettings } from '@/lib/settings';

const ChatHome = () => {
  const {
    state: { conversations, selectedConversationId, messages, isLoggedIn },
  } = useContext(ChatContext);

  const selectedConversation = useMemo(
    () => conversations?.find((c) => c.id === selectedConversationId),
    [selectedConversationId, conversations],
  );

  // FOLDER OPERATIONS  --------------------------------------------

  // const handleCreateFolder = (name: string, type: FolderType) => {
  //   const newFolder: FolderInterface = {
  //     id: uuidv4(),
  //     name,
  //     type,
  //   };

  //   const updatedFolders = [...folders, newFolder];

  //   dispatch({ field: 'folders', value: updatedFolders });
  //   saveFolders(updatedFolders);
  // };

  // const handleDeleteFolder = (folderId: string) => {
  //   const updatedFolders = folders.filter((f) => f.id !== folderId);
  //   dispatch({ field: 'folders', value: updatedFolders });
  //   saveFolders(updatedFolders);

  // const handleUpdateFolder = (folderId: string, name: string) => {
  //   const updatedFolders = folders.map((f) => {
  //     if (f.id === folderId) {
  //       return {
  //         ...f,
  //         name,
  //       };
  //     }

  //     return f;
  //   });

  //   dispatch({ field: 'folders', value: updatedFolders });

  //   saveFolders(updatedFolders);
  // };

  // EFFECTS  --------------------------------------------

  // TODO this is a responsive page change
  // useEffect(() => {
  //   if (window.innerWidth < 640) {
  //     dispatch({ field: 'showChatbar', value: false });
  //   }
  // }, [conversation]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    const settings = getSettings();
    if (settings.theme) {
      // dispatch({
      //   field: 'lightMode',
      //   value: settings.theme,
      // });
    }

    // if (window.innerWidth < 640) {
    //   dispatch({ field: 'showChatbar', value: false });
    //   dispatch({ field: 'showPromptbar', value: false });
    // }
  }, [selectedConversationId]);

  const [areSettingsOpen, setSettingsOpen] = useState(false);

  const onOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const onCloseSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  return (
    <>
      <Head>
        <title>IslandFox AI</title>
        <meta name="description" content="Chat assistant for Power Users" />
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${'dark'}`}
      >
        <div className="fixed top-0 w-full sm:hidden">
          {selectedConversation && (
            <Navbar
              selectedConversation={selectedConversation as Conversation}
              onNewConversation={() => null}
            />
          )}
        </div>

        <div className="flex h-full w-full pt-[48px] sm:pt-0">
          <Chatbar />

          <div className="flex flex-1">
            {selectedConversationId && isLoggedIn && (
              <ActiveConversation onOpenSettings={onOpenSettings} />
            )}
          </div>

          {/* <Promptbar /> */}
        </div>
        {areSettingsOpen && <ActiveSettingsDialog onClose={onCloseSettings} />}
        {!isLoggedIn && <AccountDialog />}
      </div>
    </>
  );
};
export default ChatHome;
