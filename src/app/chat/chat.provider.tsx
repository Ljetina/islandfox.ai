import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createContext } from 'react';

import { useRouter } from 'next/navigation';

import { Conversation, Message } from '@/types/chat';
import { OpenAIModelID } from '@/types/openai';

import { InitialServerData } from './chat.state';

import {
  apiCreateConversation,
  apiDeleteConversation,
  apiUpdateConversation,
} from '@/lib/conversation';
import { apiUpdateUserPreferences } from '@/lib/user';

export interface ClientState {
  conversations: Conversation[];
  messages: Message[];
  uiShowPrompts: boolean;
  uiShowConverations: boolean;
  selectedConversationId?: string;
  loading: boolean;
  messageIsStreaming: boolean;
}

export interface ChatContextProps {
  state: ClientState;
  handleNewConversation: () => void;
  toggleShowConversation: () => void;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleEditConversation: (conversation: Conversation) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  //   handleAddMessage: (message: string) => void;
  //   handleDeleteMessage: (messageId: string) => void;
}

export const ChatContext = createContext<ChatContextProps>(undefined!);

export const ChatProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(undefined);
  const [uiShowConverations, setUiShowConverations] = useState(true);
  const [uiShowPrompts, setUiShowPrompts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messageIsStreaming, setMessageIsStreaming] = useState(false);
  const router = useRouter();

  // Initial Load
  useEffect(() => {
    fetch('http://localhost:3001/initial', {
      method: 'GET',
      credentials: 'include', // Include credentials to send the session cookie
    })
      .then((response) => response.json())
      .then((data: InitialServerData) => {
        // setInitialData(data);
        console.log({ data });
        setUiShowConverations(data.ui_show_conversations);
        setUiShowPrompts(data.ui_show_prompts);
        setConversations(data.conversations || []);
        const selectedConversation =
          data.conversations && data.conversations.length > 0
            ? data.conversations[0]
            : undefined;
        if (selectedConversation) {
          setSelectedConversationId(selectedConversation.id);
          setMessages(selectedConversation.messages);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch initial conversations here
    // You might also fetch messages for the selected conversation here
  }, [selectedConversationId]);

  const handleNewConversation = useCallback(async () => {
    const conversation = await apiCreateConversation({
      model_id: OpenAIModelID.GPT_4,
      prompt: 'test',
      name: 'test',
      temperature: 0.5,
    });
    setConversations([...conversations, conversation]);
    setSelectedConversationId(conversation.id);
  }, [conversations, setConversations]);

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
      setSelectedConversationId(conversation.id);
      router.push('/chat/' + conversation.id);
    },
    [],
  );

  const toggleShowConversation = useCallback(async () => {
    setUiShowConverations(!uiShowConverations);
    await apiUpdateUserPreferences({
      ui_show_conversations: !uiShowConverations,
    });
  }, [uiShowConverations, setUiShowConverations]);

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
        },
        handleNewConversation,
        handleDeleteConversation,
        toggleShowConversation,
        handleEditConversation,
        handleSelectConversation,
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
