'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';

// import { GetServerSideProps } from 'next';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import useErrorService from '@/services/errorService';
// import useApiService from '@/services/useApiService';
import Head from 'next/head';

import { useCreateReducer } from '@/hooks/useCreateReducer';
import { useInitialData } from '@/hooks/useInitialData';

import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderInterface, FolderType } from '@/types/folder';
import { OpenAIModelID, OpenAIModels } from '@/types/openai';
import { Prompt } from '@/types/prompt';

import { Chat } from '@/components/Chat/Chat';
import List from '@/components/Chat/MessageVirtuoso';
import ActiveConversation from '@/components/Chat/NewActiveConversation';
import { Chatbar } from '@/components/Chatbar/ChatbarPlaceholder';
// import { Chatbar } from '@/components/Chatbar/Chatbar';
import { Navbar } from '@/components/Mobile/Navbar';
import Promptbar from '@/components/Promptbar';

import '../globals.css';
import { ChatContext, withChatProvider } from './chat.provider';
import {
  ChatInitialState,
  InitialServerData,
  initialState,
} from './chat.state';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/lib/clean';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/lib/const';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/lib/conversation';
import { saveFolders } from '@/lib/folders';
import { savePrompts } from '@/lib/prompts';
import { getSettings } from '@/lib/settings';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  // initialData: InitialServerData;
  conversationId?: string;
}

const ChatHome = ({ conversationId }: Props) => {
  // const { initialData, isLoading } = useInitialData();

  //   const { t } = useTranslation('chat');
  //   const { getModels } = useApiService();
  //   const { getModelsError } = useErrorService();
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const defaultModelId = OpenAIModelID.GPT_4;

  const {
    state: { conversations, selectedConversationId, messages },
  } = useContext(ChatContext);

  const conversation = useMemo(
    () =>
      conversations &&
      selectedConversationId &&
      selectedConversationId in conversations
        ? conversations.find((c) => c.id == selectedConversationId)
        : undefined,
    [conversations, selectedConversationId],
  );

  const handleSelectConversation = (conversation: Conversation) => {
    // dispatch({
    //   field: 'selectedConversationId',
    //   value: conversation.id,
    // });
  };

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

  //   const updatedConversations: Conversation[] = conversations.map((c) => {
  //     if (c.folderId === folderId) {
  //       return {
  //         ...c,
  //         folderId: null,
  //       };
  //     }

  //     return c;
  //   });

  //   dispatch({ field: 'conversations', value: updatedConversations });
  //   saveConversations(updatedConversations);

  //   const updatedPrompts: Prompt[] = prompts.map((p) => {
  //     if (p.folderId === folderId) {
  //       return {
  //         ...p,
  //         folderId: null,
  //       };
  //     }

  //     return p;
  //   });

  //   dispatch({ field: 'prompts', value: updatedPrompts });
  //   savePrompts(updatedPrompts);
  // };

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

  // CONVERSATION OPERATIONS  --------------------------------------------

  // const handleNewConversation = () => {
  //   const lastConversation = conversations[conversations.length - 1];
  //   console.log(defaultModelId);

  //   const newConversation: Conversation = {
  //     id: uuidv4(),
  //     name: 'New Conversation',
  //     messages: [],
  //     model: lastConversation?.model || {
  //       id: OpenAIModels[defaultModelId].id,
  //       name: OpenAIModels[defaultModelId].name,
  //       maxLength: OpenAIModels[defaultModelId].maxLength,
  //       tokenLimit: OpenAIModels[defaultModelId].tokenLimit,
  //     },
  //     prompt: DEFAULT_SYSTEM_PROMPT,
  //     temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
  //     folderId: null,
  //   };

  //   const updatedConversations = [...conversations, newConversation];

  //   dispatch({ field: 'selectedConversation', value: newConversation });
  //   dispatch({ field: 'conversations', value: updatedConversations });

  //   saveConversation(newConversation);
  //   saveConversations(updatedConversations);

  //   dispatch({ field: 'loading', value: false });
  // };

  // const handleUpdateConversation = (
  //   conversation: Conversation,
  //   data: KeyValuePair,
  // ) => {
  //   const updatedConversation = {
  //     ...conversation,
  //     [data.key]: data.value,
  //   };

  //   const { single, all } = updateConversation(
  //     updatedConversation,
  //     conversations,
  //   );

  //   dispatch({ field: 'selectedConversation', value: single });
  //   dispatch({ field: 'conversations', value: all });
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

    // const showChatbar = localStorage.getItem('showChatbar');
    // if (showChatbar) {
    //   dispatch({ field: 'showChatbar', value: showChatbar === 'true' });
    // }

    // const showPromptbar = localStorage.getItem('showPromptbar');
    // if (showPromptbar) {
    //   dispatch({ field: 'showPromptbar', value: showPromptbar === 'true' });
    // }

    // TODO these two are no longer necessary, they come from initialData, keeping for reference for now
    // const folders = localStorage.getItem('folders');
    // if (folders) {
    //   dispatch({ field: 'folders', value: JSON.parse(folders) });
    // }

    // const prompts = localStorage.getItem('prompts');
    // if (prompts) {
    //   dispatch({ field: 'prompts', value: JSON.parse(prompts) });
    // }

    // TODO new  conversation, but also conversationHistory as a list? Not sure, I think this
    // is replaced by conversations from initialData
    // const conversationHistory = localStorage.getItem('conversationHistory');
    // console.log({ conversationHistory });
    // if (conversationHistory) {
    //   const parsedConversationHistory: Conversation[] =
    //     JSON.parse(conversationHistory);
    //   const cleanedConversationHistory = cleanConversationHistory(
    //     parsedConversationHistory,
    //   );

    //   dispatch({ field: 'conversations', value: cleanedConversationHistory });

    //   if (conversationId && cleanedConversationHistory) {
    //     const selectedConversation = cleanedConversationHistory.find(
    //       (c) => c.id == conversationId,
    //     );
    //     console.log('DISPATCHING', { selectedConversation });
    //     if (selectedConversation) {
    //       dispatch({
    //         field: 'selectedConversation',
    //         value: selectedConversation,
    //       });
    //     } else {
    //       dispatchDefaultNewConversation();
    //     }
    //   } else {
    //     dispatchDefaultNewConversation();
    //   }
    // } else {
    //   dispatchDefaultNewConversation();
    // }
    // function dispatchDefaultNewConversation() {
    //   console.log('DEFAULT NEW CONVERSATION');
    //   dispatch({
    //     field: 'selectedConversation',
    //     value: {
    //       id: uuidv4(),
    //       name: 'New Conversation',
    //       messages: [],
    //       model: OpenAIModels[defaultModelId],
    //       prompt: DEFAULT_SYSTEM_PROMPT,
    //       temperature: temperature ?? DEFAULT_TEMPERATURE,
    //       folderId: null,
    //     },
    //   });
    // }

    // const selectedConversation = localStorage.getItem('selectedConversation');
    // console.log({selectedConversation})
    // if (selectedConversation) {
    //   const parsedSelectedConversation: Conversation =
    //     JSON.parse(selectedConversation);
    //   const cleanedSelectedConversation = cleanSelectedConversation(
    //     parsedSelectedConversation,
    //   );

    //   dispatch({
    //     field: 'selectedConversation',
    //     value: cleanedSelectedConversation,
    //   });
    // } else {
    //   const lastConversation = conversations[conversations.length - 1];
    //   dispatch({
    //     field: 'selectedConversation',
    //     value: {
    //       id: uuidv4(),
    //       name: 'New Conversation',
    //       messages: [],
    //       model: OpenAIModels[defaultModelId],
    //       prompt: DEFAULT_SYSTEM_PROMPT,
    //       temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
    //       folderId: null,
    //     },
    //   });
    // }
  }, [selectedConversationId]);

  // console.log({ initialData });
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

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
      <main
        className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${'dark'}`}
      >
        <div className="fixed top-0 w-full sm:hidden">
          {/* TODO fix up structure when working on putting the prompts back in conversation */}

          {/* <Navbar
              selectedConversation={conversation}
              onNewConversation={handleNewConversation}
            /> */}
        </div>

        <div className="flex h-full w-full pt-[48px] sm:pt-0">
          <Chatbar />

          <div className="flex flex-1">
            {/* <List /> */}
            <ActiveConversation />
            {/* <Chat stopConversationRef={stopConversationRef} /> */}
          </div>

          {/* <Promptbar /> */}
        </div>
      </main>
    </>
  );
};
export default ChatHome;

// export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
//   const defaultModelId =
//     (process.env.DEFAULT_MODEL &&
//       Object.values(OpenAIModelID).includes(
//         process.env.DEFAULT_MODEL as OpenAIModelID,
//       ) &&
//       process.env.DEFAULT_MODEL) ||
//     fallbackModelID;

//   let serverSidePluginKeysSet = false;

//   const googleApiKey = process.env.GOOGLE_API_KEY;
//   const googleCSEId = process.env.GOOGLE_CSE_ID;

//   if (googleApiKey && googleCSEId) {
//     serverSidePluginKeysSet = true;
//   }

//   return {
//     props: {
//       serverSideApiKeyIsSet: !!process.env.OPENAI_API_KEY,
//       defaultModelId,
//       serverSidePluginKeysSet,
//       ...(await serverSideTranslations(locale ?? 'en', [
//         'common',
//         'chat',
//         'sidebar',
//         'markdown',
//         'promptbar',
//         'settings',
//       ])),
//     },
//   };
// };
