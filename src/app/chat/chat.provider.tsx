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

export interface ClientState {
  conversations: Conversation[];
  messages: Message[];
  uiShowPrompts: boolean;
  uiShowConverations: boolean;
  selectedConversationId?: string;
  loading: boolean;
  messageIsStreaming: boolean;
  totalCount: number;
  firstItemIndex: number;
  jupyterSettings: JupyterGlobalSettings;
  notebookSettings: JupyterConversationSettings | null;
  remainingCredits: number;
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
  handleAddMessage: (
    userUuid: string,
    assistantUuid: string,
    query: string,
  ) => void;
  handleDeleteMessage: (messageId: string) => void;
  setIsMessageStreaming: (isStreaming: boolean) => void;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  setFirstItemIndex: React.Dispatch<React.SetStateAction<number>>;
  handleUpdateGlobalNotebookSettings: (
    props: JupyterGlobalSettings,
  ) => Promise<boolean>;
  updateNotebookSettings: () => Promise<void>;
  saveNotebookSettings: (props: {
    kernelId: string;
    sessionId: string;
    notebookPath: string;
    notebookName: string;
  }) => Promise<Partial<JupyterConversationSettings> | undefined>;
  setRemainingCredits: (credits: number) => void;
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
  const [uiShowConverations, setUiShowConverations] = useState(true);
  const [uiShowPrompts, setUiShowPrompts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messageIsStreaming, setMessageIsStreaming] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [firstItemIndex, setFirstItemIndex] = useState(totalCount);
  const [jupyterSettings, setJupyterSettings] = useState({
    host: '',
    port: '',
    serverToken: '',
    notebookFolderPath: '',
  });
  const [notebookSettings, setNotebookSettings] =
    useState<JupyterConversationSettings | null>(null);
  const router = useRouter();

  // Initial Load
  useEffect(() => {
    fetch('http://localhost:3001/initial', {
      method: 'GET',
      credentials: 'include', // Include credentials to send the session cookie
    })
      .then((response) => response.json())
      .then((data: InitialServerData) => {
        setUiShowConverations(data.ui_show_conversations);
        setUiShowPrompts(data.ui_show_prompts);
        setConversations(data.conversations || []);
        setRemainingCredits(data.tenant_credits);
        setJupyterSettings({
          host: data.jupyter_settings.host,
          port: data.jupyter_settings.port,
          serverToken: data.jupyter_settings.token,
          notebookFolderPath: data.jupyter_settings.notebooks_folder_path,
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
  }, []);

  // change conversation useEffect
  useEffect(() => {
    if (selectedConversationId) {
      updateNotebookSettings();
    }
  }, [selectedConversationId, setNotebookSettings]);

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
      kernelId: string;
      sessionId: string;
      notebookPath: string;
      notebookName: string;
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
    setMessages([]);
    setSelectedConversationId(undefined);
    setTotalCount(0);
    setFirstItemIndex(0);
    const conversation = await apiCreateConversation({
      model_id: OpenAIModelID.GPT_3_5,
      prompt: 'test',
      name: 'New',
      temperature: 0.5,
    });
    setSelectedConversationId(conversation.id);
    setConversations([...conversations, conversation]);
    router.push('/chat/' + conversation.id);
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
    [conversations, setConversations],
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
      router.push('/chat/' + conversation.id);
    },
    [selectedConversationId],
  );

  const toggleShowConversation = useCallback(async () => {
    setUiShowConverations(!uiShowConverations);
    await apiUpdateUserPreferences({
      ui_show_conversations: !uiShowConverations,
    });
  }, [uiShowConverations, setUiShowConverations]);

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
    [messages, setMessages, selectedConversationId],
  );

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
    [messageIsStreaming, setMessageIsStreaming],
  );

  const handleUpdateGlobalNotebookSettings = useCallback(
    async (settings: any) => {
      const savedSettings = await apiSaveNotebookSettings(settings);
      setJupyterSettings({
        host: savedSettings.host,
        port: savedSettings.port,
        serverToken: savedSettings.token,
        notebookFolderPath: savedSettings.notebooks_folder_path,
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
          firstItemIndex,
          jupyterSettings,
          notebookSettings,
          remainingCredits,
        },
        setRemainingCredits,
        handleNewConversation,
        handleDeleteConversation,
        toggleShowConversation,
        handleEditConversation,
        handleSelectConversation,
        handleUpdateMessageContent,
        handleAddMessagePage,
        handleAddMessage,
        handleDeleteMessage,
        setIsMessageStreaming,
        setTotalCount,
        setFirstItemIndex,
        handleUpdateGlobalNotebookSettings,
        updateNotebookSettings,
        saveNotebookSettings,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const withChatProvider = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  return (props: P) => {
    return (
      <ChatProvider>
        <WrappedComponent {...props} />
      </ChatProvider>
    );
  };
};
