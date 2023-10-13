import { useCallback, useContext, useEffect, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

import { ServerMessage } from '@/types/chat';

import { useDebounce } from './useDebounce';
import { useEmitter } from './useEvents';

import { ChatContext } from '@/app/chat/chat.provider';

export const useChatter = () => {
  const {
    state: { selectedConversationId },
    handleAddMessage,
    handleDeleteMessage,
    handleUpdateMessageContent,
    setIsMessageStreaming,
  } = useContext(ChatContext);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:8080/conversation/${selectedConversationId}`,
    {
      onOpen: () => console.log('opened'),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    },
  );

  const [query, setQuery] = useState('');
  const [lastHandledMessage, setLastHandledMessage] = useState(lastMessage);
  const [currentAssisstantId, setCurrentAssisstantId] = useState<string | null>(
    null,
  );

  const emit = useEmitter();

  const debouncedScrollDownClick = useDebounce(() => {
    emit('scrollDownClicked', null);
  }, 1000);

  useEffect(() => {
    if (lastMessage && lastHandledMessage !== lastMessage) {
      setLastHandledMessage(lastMessage);
      const serverMessage: ServerMessage = JSON.parse(lastMessage?.data);
      if (serverMessage.type === 'message_ack') {
        const { userUuid, assistantUuid } = serverMessage.data as {
          userUuid: string;
          assistantUuid: string;
        };
        handleAddMessage(userUuid, assistantUuid, query);
        setCurrentAssisstantId(assistantUuid);
        setQuery('');
        setTimeout(() => {
          debouncedScrollDownClick();
        }, 100);
      } else if (serverMessage.type === 'append_to_message') {
        handleUpdateMessageContent(
          currentAssisstantId as string,
          serverMessage.data as string,
          true,
        );
        emit('scrollDownClicked', null);
      } else if (serverMessage.type === 'response_done') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
        emit('scrollDownClicked', null);
      }
    }
  }, [
    lastMessage,
    setLastHandledMessage,
    lastHandledMessage,
    query,
    handleAddMessage,
    currentAssisstantId,
    setCurrentAssisstantId,
  ]);

  const sendQuery = useCallback(
    (query: string) => {
      setIsMessageStreaming(true);
      setQuery(query);
      sendMessage(
        JSON.stringify({
          action: 'create_message',
          text: query,
        }),
      );
    },
    [sendMessage, setIsMessageStreaming],
  );

  return {
    sendQuery,
  };
};
