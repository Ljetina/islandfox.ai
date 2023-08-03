import { useCallback, useContext, useEffect, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';
import { OpenAIModels } from '@/types/openai';
import { PluginKey } from '@/types/plugin';

import { ChatFolders } from './components/ChatFolders';
import { ChatbarSettings } from './components/ChatbarSettings';
import { Conversations } from './components/Conversations';

import Sidebar from '../Sidebar';
import ChatbarContext from './Chatbar.context';
import { ChatbarInitialState, initialState } from './Chatbar.state';

import ChatContext from '@/app/chat/chat.context';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/lib/const';
import { saveConversation, saveConversations } from '@/lib/conversation';
import { saveFolders } from '@/lib/folders';
import { exportData, importData } from '@/lib/importExport';
import { v4 as uuidv4 } from 'uuid';

export const Chatbar = () => {
  const { t } = useTranslation('sidebar');

  const chatBarContextValue = useCreateReducer<ChatbarInitialState>({
    initialState,
  });

  const {
    state: { conversations, ui_show_conversations, folders },
    dispatch: homeDispatch,
    // handleCreateFolder,
    // handleNewConversation,
    // handleUpdateConversation,
  } = useContext(ChatContext);

  console.log({conversations})

  const {
    state: { searchTerm },
    dispatch: chatDispatch,
  } = chatBarContextValue;

  const handleExportData = () => {
    exportData();
  };

  // TODO worry about import later
  // const handleImportConversations = (data: SupportedExportFormats) => {
  //   const { history, folders, prompts }: LatestExportFormat = importData(data);
  //   homeDispatch({ field: 'conversations', value: history });
  //   homeDispatch({
  //     field: 'selectedConversation',
  //     value: history[history.length - 1],
  //   });
  //   homeDispatch({ field: 'folders', value: folders });
  //   homeDispatch({ field: 'prompts', value: prompts });

  //   window.location.reload();
  // };

  const handleClearConversations = () => {
    // defaultModelId &&
    //   homeDispatch({
    //     field: 'selectedConversation',
    //     value: {
    //       id: uuidv4(),
    //       name: t('New Conversation'),
    //       messages: [],
    //       model: OpenAIModels[defaultModelId],
    //       prompt: DEFAULT_SYSTEM_PROMPT,
    //       temperature: DEFAULT_TEMPERATURE,
    //       folderId: null,
    //     },
    //   });
    // homeDispatch({ field: 'conversations', value: [] });
    // localStorage.removeItem('conversationHistory');
    // localStorage.removeItem('selectedConversation');
    // const updatedFolders = folders.filter((f) => f.type !== 'chat');
    // homeDispatch({ field: 'folders', value: updatedFolders });
    // saveFolders(updatedFolders);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    // const updatedConversations = conversations.filter(
    //   (c) => c.id !== conversation.id,
    // );
    // homeDispatch({ field: 'conversations', value: updatedConversations });
    // chatDispatch({ field: 'searchTerm', value: '' });
    // saveConversations(updatedConversations);
    // if (updatedConversations.length > 0) {
    //   homeDispatch({
    //     field: 'selectedConversation',
    //     value: updatedConversations[updatedConversations.length - 1],
    //   });
    //   saveConversation(updatedConversations[updatedConversations.length - 1]);
    // } else {
    //   defaultModelId &&
    //     homeDispatch({
    //       field: 'selectedConversation',
    //       value: {
    //         id: uuidv4(),
    //         name: t('New Conversation'),
    //         messages: [],
    //         model: OpenAIModels[defaultModelId],
    //         prompt: DEFAULT_SYSTEM_PROMPT,
    //         temperature: DEFAULT_TEMPERATURE,
    //         folderId: null,
    //       },
    //     });
    //   localStorage.removeItem('selectedConversation');
    // }
  };

  const filteredConversations = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length == 0) {
      return conversations;
    }
    return conversations?.filter((c) =>
      c.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );
  }, [searchTerm, conversations]);

  const handleToggleChatbar = () => {
    homeDispatch({
      field: 'ui_show_conversations',
      value: !ui_show_conversations,
    });
  };

  const handleDrop = (e: any) => {
    // if (e.dataTransfer) {
    //   const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
    //   handleUpdateConversation(conversation, { key: 'folderId', value: 0 });
    //   chatDispatch({ field: 'searchTerm', value: '' });
    //   e.target.style.background = 'none';
    // }
  };

  useEffect(() => {
    // if (searchTerm) {
    //   // TODO Fix search to be server side
    //   chatDispatch({
    //     field: 'filteredConversations',
    //     value: conversations?.filter((conversation) => {
    //       const searchable =
    //         conversation.name.toLocaleLowerCase() +
    //         ' ' +
    //         conversation.messages.map((message) => message.content).join(' ');
    //       return searchable.toLowerCase().includes(searchTerm.toLowerCase());
    //     }),
    //   });
    // } else {
    //   chatDispatch({
    //     field: 'filteredConversations',
    //     value: conversations,
    //   });
    // }
  }, [searchTerm, conversations]);

  console.log('RENDERING CHAT BAR');
  return (
    <ChatbarContext.Provider
      value={{
        ...chatBarContextValue,
        handleDeleteConversation,
        handleClearConversations,
        // handleImportConversations,
        handleExportData,
        // handlePluginKeyChange,
        // handleClearPluginKey,
        // handleApiKeyChange,
      }}
    >
      <Sidebar<Conversation>
        side={'left'}
        isOpen={ui_show_conversations}
        addItemButtonTitle={t('New chat')}
        itemComponent={<Conversations conversations={filteredConversations as Conversation[]} />}
        folderComponent={<ChatFolders searchTerm={searchTerm} />}
        items={filteredConversations}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          chatDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleToggleChatbar}
        // handleCreateItem={handleNewConversation}
        // handleCreateFolder={() => handleCreateFolder(t('New folder'), 'chat')}
        handleDrop={handleDrop}
        footerComponent={<ChatbarSettings />}
      />
    </ChatbarContext.Provider>
  );
};
