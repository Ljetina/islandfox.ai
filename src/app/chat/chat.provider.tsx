import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createContext } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Conversation, Message, Role } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { InitialServerData } from './chat.state';

import { blurFetch, getConversationMessages } from '@/lib/api';
import {
  apiCreateConversation,
  apiDeleteConversation,
  apiGetConversationNotebookSettings,
  apiSaveConversationNotebookSettings,
  apiSaveNotebookSettings,
  apiUpdateConversation,
} from '@/lib/conversation';
import {
  JupyterConversationSettings,
  JupyterGlobalSettings,
  testConnection,
} from '@/lib/jupyter';
import { apiUpdateUserPreferences } from '@/lib/user';
import { trackEvent } from '@/hooks/useTrackPage';

export interface ClientState {
  email?: string;
  tenantId?: string;
  conversations: Conversation[];
  messages: Message[];
  uiShowPrompts: boolean;
  uiShowConverations: boolean;
  selectedConversationId?: string;
  loading: boolean;
  messageIsStreaming: boolean;
  totalCount: number;
  isLoadingMore: boolean;
  hasMore: boolean;
  page: number;
  firstItemIndex: number;
  jupyterSettings: JupyterGlobalSettings;
  notebookSettings: JupyterConversationSettings | null;
  remainingCredits: number;
  isLoggedIn: boolean;
  hasCheckedAuth: boolean;
}

export interface ChatContextProps {
  state: ClientState;
  handleNewConversation: () => void;
  toggleShowConversation: () => void;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleEditConversation: (conversation: Conversation) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  handleAddMessagePage: (pageMessages: Message[], replace?: boolean) => number;
  handleUpdateMessageContent: (
    messageId: string,
    content: string,
    append?: boolean,
  ) => void;
  handleRegenerateLastMessage: () => string | undefined;
  handleAddMessage: (
    userUuid: string,
    assistantUuid: string,
    query: string,
  ) => void;
  handleAddAssistantMessage: (assistantUuid: string) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleUpdateConversationName: (
    conversationId: string,
    conversationName: string
  ) => void;
  setIsMessageStreaming: (isStreaming: boolean) => void;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  setFirstItemIndex: React.Dispatch<React.SetStateAction<number>>;
  handleUpdateGlobalNotebookSettings: (
    props: JupyterGlobalSettings,
  ) => Promise<boolean>;
  updateNotebookSettings: () => Promise<void>;
  saveNotebookSettings: (props: {
    kernelId?: string;
    sessionId?: string;
    notebookPath?: string;
    notebookName?: string;
  }) => Promise<Partial<JupyterConversationSettings> | undefined>;
  setRemainingCredits: (credits: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  loadMoreMessages: () => void;
}

export const ChatContext = createContext<ChatContextProps>(undefined!);

export const ChatProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const params = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(params && params.convid ? (params?.convid as string) : undefined);
  const [uiShowConverations, setUiShowConverations] = useState(false);
  const [uiShowPrompts, setUiShowPrompts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageIsStreaming, setMessageIsStreaming] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [firstItemIndex, setFirstItemIndex] = useState(totalCount);
  const [jupyterSettings, setJupyterSettings] = useState({
    host: '',
    port: '',
    serverToken: '',
  });
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [notebookSettings, setNotebookSettings] =
    useState<JupyterConversationSettings | null>(null);
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    blurFetch({ pathname: 'auth/check', method: 'GET' })
      .then((d) => {
        setHasCheckedAuth(true);
        setIsLoggedIn(true);
      })
      .catch((e) => {
        setHasCheckedAuth(true);
        setIsLoggedIn(false);
      });
  }, []);

  // Initial Load
  useEffect(() => {
    if (isLoggedIn) {
      blurFetch({ pathname: 'initial', method: 'GET' })
        .then((data: InitialServerData) => {
          setUiShowConverations(data.ui_show_conversations);
          setUiShowPrompts(data.ui_show_prompts);
          setConversations(data.conversations || []);
          setRemainingCredits(data.tenant_credits);
          setTenantId(data.tenant_id);
          setEmail(data.email);
          setJupyterSettings({
            host: data.jupyter_settings.host,
            port: data.jupyter_settings.port,
            serverToken: data.jupyter_settings.token,
          });
          let selectedConversation = null;
          if (data.conversations && data.conversations.length > 0) {
            if (selectedConversationId) {
              selectedConversation = data.conversations.find(
                (c) => c.id === selectedConversationId,
              );
            } else {
              selectedConversation =
                data.conversations[data.conversations.length - 1];
            }
          }
          if (selectedConversation) {
            setSelectedConversationId(selectedConversation.id);
            setTotalCount(selectedConversation.message_count);
            setFirstItemIndex(selectedConversation.message_count);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  // change conversation useEffect
  useEffect(() => {
    if (isLoggedIn && selectedConversationId) {
      updateNotebookSettings();
    }
  }, [isLoggedIn, selectedConversationId, setNotebookSettings]);

  const updateNotebookSettings = useCallback(async () => {
    if (selectedConversationId) {
      const notebookSettings: Partial<JupyterConversationSettings> =
        await apiGetConversationNotebookSettings(selectedConversationId);
      setNotebookSettings({
        conversation_id: selectedConversationId,
        kernel_id: notebookSettings.kernel_id as string,
        notebook_name: notebookSettings.notebook_name as string,
        notebook_path: notebookSettings.notebook_path as string,
        session_id: notebookSettings.session_id as string,
      });
    }
  }, [selectedConversationId, setNotebookSettings]);

  const saveNotebookSettings = useCallback(
    async ({
      kernelId,
      sessionId,
      notebookPath,
      notebookName,
    }: {
      kernelId?: string;
      sessionId?: string;
      notebookPath?: string;
      notebookName?: string;
    }) => {
      if (selectedConversationId) {
        await apiSaveConversationNotebookSettings({
          conversation_id: selectedConversationId,
          kernel_id: kernelId,
          session_id: sessionId,
          notebook_name: notebookName,
          notebook_path: notebookPath,
        });
        const notebookSettings: Partial<JupyterConversationSettings> =
          await apiGetConversationNotebookSettings(selectedConversationId);
        setNotebookSettings({
          conversation_id: selectedConversationId,
          kernel_id: notebookSettings.kernel_id as string,
          notebook_name: notebookSettings.notebook_name as string,
          notebook_path: notebookSettings.notebook_path as string,
          session_id: notebookSettings.session_id as string,
        });
        return notebookSettings;
      }
    },
    [selectedConversationId, setNotebookSettings],
  );

  const handleNewConversation = useCallback(async () => {
    trackEvent({ action: 'click', category: 'button', label: 'new_conversation' });
    setMessages([]);
    setSelectedConversationId(undefined);
    setTotalCount(0);
    setFirstItemIndex(0);
    const conversation = await apiCreateConversation({
      model_id: OpenAIModelID.GPT_4,
      prompt: '',
      name: 'New',
      temperature: 0.5,
    });
    setSelectedConversationId(conversation.id);
    setConversations([...conversations, conversation]);
    // router.replace('/chat/' + conversation.id);
    window.history.replaceState({}, '', '/chat/' + conversation.id);
  }, [
    conversations,
    setConversations,
    setSelectedConversationId,
    setTotalCount,
    setFirstItemIndex,
    setMessages,
  ]);

  const handleDeleteConversation = useCallback(
    async (conversation: Conversation) => {
      if (selectedConversationId == conversation.id) {
        const firstAvailableConversation = conversations.find(
          (c) => c.id !== conversation.id,
        );
        if (firstAvailableConversation) {
          setSelectedConversationId(firstAvailableConversation.id);
        }
      }
      setConversations(conversations.filter((c) => c.id !== conversation.id));
      await apiDeleteConversation(conversation.id);
    },
    [conversations, setConversations, selectedConversationId],
  );

  const handleEditConversation = useCallback(
    async (conversation: Conversation) => {
      setConversations(
        conversations.map((c) => {
          if (c.id == conversation.id) {
            return conversation;
          }
          return c;
        }),
      );
      const { prompt, model_id, name, temperature } = conversation;
      await apiUpdateConversation(conversation.id, {
        prompt,
        model_id,
        name,
        temperature,
      });
    },
    [setConversations, conversations],
  );

  const handleSelectConversation = useCallback(
    async (conversation: Conversation) => {
      if (conversation.id === selectedConversationId) {
        return;
      }
      setSelectedConversationId(conversation.id);
      // router.replace('/chat/' + conversation.id);
      window.history.replaceState({}, '', '/chat/' + conversation.id);
    },
    [selectedConversationId],
  );

  const toggleShowConversation = useCallback(async () => {
    setUiShowConverations(!uiShowConverations);
    await apiUpdateUserPreferences({
      ui_show_conversations: !uiShowConverations,
    });
  }, [uiShowConverations, setUiShowConverations]);

  const handleRegenerateLastMessage = useCallback(() => {
    if (messages.length > 0) {
      const lastUserIndex = messages.findIndex((m) => m.role === 'user');
      const userMessage = messages[lastUserIndex];
      setMessages(messages.slice(lastUserIndex));
      setFirstItemIndex((fii) => fii + lastUserIndex);
      setTotalCount((tc) => tc - lastUserIndex);
      return userMessage.id;
    }
  }, [messages]);

  const handleUpdateMessageContent = useCallback(
    (messageId: string, content: string, append = false) => {
      setMessages(
        messages.map((m) => {
          if (m.id === messageId) {
            if (append) {
              m.content += content;
            } else {
              m.content = content;
            }
          }
          return m;
        }),
      );
    },
    [messages, setMessages],
  );

  const handleAddMessagePage = useCallback(
    (pageMessages: Message[], replace = false) => {
      if (replace) {
        setMessages(pageMessages);
        return pageMessages.length;
      } else {
        const originalLength = messages.length;
        const newMessages = [...messages, ...pageMessages];
        const deduplicatedMessages = newMessages.reduce(
          (acc: Message[], current: Message) => {
            const duplicate = acc.find((message) => message.id === current.id);
            return duplicate ? acc : [...acc, current];
          },
          [],
        );
        setMessages(deduplicatedMessages);
        return deduplicatedMessages.length - originalLength;
      }
    },
    [messages, setMessages],
  );

  const handleAddAssistantMessage = useCallback(
    (assistantUuid: string) => {
      if (!selectedConversationId) {
        return;
      }
      const now = new Date().toString();
      setMessages(
        [
          {
            role: 'assistant' as Role,
            content: '',
            id: assistantUuid,
            conversation_id: selectedConversationId,
            created_at: now,
            updated_at: now,
          },
          // @ts-ignore
        ].concat(messages),
      );
      setFirstItemIndex((fii) => Math.max(fii - 1, 0));
      setTotalCount((tc) => tc + 1);
    },
    [
      selectedConversationId,
      setMessages,
      messages,
      setFirstItemIndex,
      setTotalCount,
    ],
  );

  const loadPage = useCallback(
    async (
      {
        page,
        limit,
      }: {
        page: number;
        limit: number;
      },
      replace?: boolean,
    ): Promise<undefined> => {
      try {
        if (selectedConversationId) {
          setIsLoadingMore(true);
          const resp = await getConversationMessages({
            conversation_id: selectedConversationId,
            page: page,
            limit: limit,
          });
          setTotalCount(resp.pagination.total_records);
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage(page);
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          const numAdded = handleAddMessagePage(resp.data, replace);
          if (!replace) {
            setFirstItemIndex((fii) => Math.max(fii - numAdded, 0));
          }
        }
      } finally {
        setIsLoadingMore(false);
      }
    },
    [selectedConversationId, handleAddMessagePage],
  );

  useEffect(() => {
    async function loadFirstPage() {
      const conversation = conversations.find(
        (c) => c.id === selectedConversationId,
      );
      if (conversation) {
        setTotalCount(conversation?.message_count);
        setFirstItemIndex(
          conversation?.message_count -
            Math.min(conversation?.message_count, 50),
        );
        await loadPage({ page: 1, limit: 50 }, true);
      } else {
        // This one doesn't replace as we only get here on an initial load.
        await loadPage({ page: 1, limit: 50 }, false);
      }
    }
    setHasMore(false);
    setMessages([]);
    loadFirstPage();
  }, [selectedConversationId]);

  const loadMoreMessages = useCallback(async () => {
    return await loadPage({ page: page + 1, limit: 50 });
  }, [loadPage, page]);

  const handleAddMessage = useCallback(
    (userUuid: string, assistantUuid: string, query: string) => {
      if (!selectedConversationId) {
        return;
      }
      const now = new Date().toString();
      setMessages(
        [
          {
            role: 'assistant' as Role,
            content: '',
            id: assistantUuid,
            conversation_id: selectedConversationId,
            created_at: now,
            updated_at: now,
          },
          {
            role: 'user' as Role,
            content: query,
            id: userUuid,
            conversation_id: selectedConversationId,
            created_at: now,
            updated_at: now,
          },
          // @ts-ignore
        ].concat(messages),
      );
      setFirstItemIndex((fii) => Math.max(fii - 2, 0));
      setTotalCount((tc) => tc + 2);
    },
    [
      selectedConversationId,
      setMessages,
      setTotalCount,
      setFirstItemIndex,
      messages,
    ],
  );

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      setMessages(messages.filter((m) => m.id !== messageId));
    },
    [messages, setMessages],
  );

  const setIsMessageStreaming = useCallback(
    (isStreaming: boolean) => {
      setMessageIsStreaming(isStreaming);
    },
    [setMessageIsStreaming],
  );

  const handleUpdateConversationName = useCallback(
    (conversationId: string, conversationName: string) => {
      setConversations(
        conversations.map((c) => {
          if (c.id == conversationId) {
            return { ...c, name: conversationName };
          }
          return c;
        }),
      );
    },
    [setConversations, conversations]
  );

  const handleUpdateGlobalNotebookSettings = useCallback(
    async (settings: any) => {
      const savedSettings = await apiSaveNotebookSettings(settings);
      setJupyterSettings({
        host: savedSettings.host,
        port: savedSettings.port,
        serverToken: savedSettings.token,
      });
      return await testConnection(settings);
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        state: {
          conversations,
          messages,
          selectedConversationId,
          loading,
          uiShowConverations,
          uiShowPrompts,
          messageIsStreaming,
          totalCount,
          isLoadingMore,
          hasMore,
          page,
          firstItemIndex,
          jupyterSettings,
          notebookSettings,
          remainingCredits,
          email,
          tenantId,
          isLoggedIn,
          hasCheckedAuth
        },
        setRemainingCredits,
        handleNewConversation,
        handleDeleteConversation,
        toggleShowConversation,
        handleEditConversation,
        handleSelectConversation,
        handleUpdateMessageContent,
        handleRegenerateLastMessage,
        handleAddMessagePage,
        loadMoreMessages,
        handleAddMessage,
        handleAddAssistantMessage,
        handleDeleteMessage,
        handleUpdateConversationName,
        setIsMessageStreaming,
        setTotalCount,
        setFirstItemIndex,
        handleUpdateGlobalNotebookSettings,
        updateNotebookSettings,
        saveNotebookSettings,
        setIsLoggedIn,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.displayName = 'ChatProvider';

export const withChatProvider = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const Wrapper = (props: P) => {
    return (
      <ChatProvider>
        <WrappedComponent {...props} />
      </ChatProvider>
    );
  };
  Wrapper.displayName = 'ProviderWrapper';
  return Wrapper;
};
