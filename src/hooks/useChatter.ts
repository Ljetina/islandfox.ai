import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { useDebounce } from './useDebounce';
import { useEmitter } from './useEvents';
import { useFunctions } from './useFunctions';

import { ChatContext } from '@/app/chat/chat.provider';

export const useChatter = () => {
  const {
    state: { selectedConversationId, jupyterSettings, notebookSettings },
    handleAddMessage,
    handleAddAssistantMessage,
    handleUpdateMessageContent,
    handleRegenerateLastMessage,
    setIsMessageStreaming,
    setRemainingCredits,
  } = useContext(ChatContext);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    selectedConversationId
      ? `${
          process.env.NEXT_PUBLIC_WS_URL as string
        }/conversation/${selectedConversationId}`
      : null,
    {
      onOpen: () => console.log('opened'),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    },
  );

  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastHandledMessage, setLastHandledMessage] = useState(lastMessage);
  const [currentAssisstantId, setCurrentAssisstantId] = useState<string | null>(
    null,
  );
  const { functions } = useFunctions();

  useEffect(() => {
    if (
      jupyterSettings.host &&
      notebookSettings?.session_id &&
      readyState == 1
    ) {
      functions.read_cells({ sendMessage });
    }
  }, [jupyterSettings, notebookSettings, readyState]);

  useEffect(() => {
    if (readyState === 1) {
      const handle = setInterval(() => {
        sendMessage('ping');
      }, 10000);
      return () => clearInterval(handle);
    }
  }, [sendMessage, readyState]);

  const stopGenerating = useCallback(() => {
    sendMessage(
      JSON.stringify({
        action: 'abort',
      }),
    );
  }, [sendMessage]);

  const emit = useEmitter();

  const callCount = useRef(0);

  const onRateLimitScrollDown = useCallback(() => {
    callCount.current++;

    if (callCount.current % 20 === 0) {
      emit('scrollDownClicked', true);
    }
  }, [emit]);

  const onScrollDown = useCallback(() => {
    emit('scrollDownClicked', true);
  }, [emit]);

  const debouncedScrollDownClick = useDebounce(onScrollDown, 1000);

  const regenerateLastQuery = useCallback(() => {
    const messageId = handleRegenerateLastMessage();
    setError(undefined);
    setQuery('');
    setIsMessageStreaming(true);
    sendMessage(
      JSON.stringify({ action: 'regenerate_message', text: messageId }),
    );
  }, [handleRegenerateLastMessage]);

  useEffect(() => {
    if (lastMessage && lastHandledMessage !== lastMessage) {
      setLastHandledMessage(lastMessage);
      if (lastMessage?.data === 'pong') {
        return;
      }
      let serverMessage;
      try {
        serverMessage = JSON.parse(lastMessage?.data);
      } catch (e) {
        console.error('failed to parse server message', e, lastMessage.data);
        return;
      }
      if (serverMessage.type === 'message_regenerate_ack') {
        const { userUuid, assistantUuid } = serverMessage.data as {
          userUuid: string;
          assistantUuid: string;
        };
        handleAddAssistantMessage(assistantUuid);
        setCurrentAssisstantId(assistantUuid);
        setTimeout(() => {
          debouncedScrollDownClick();
        }, 100);
      } else if (serverMessage.type === 'message_ack') {
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
        onRateLimitScrollDown();
      } else if (serverMessage.type === 'start_frontend_function') {
        if (
          typeof serverMessage.data == 'object' &&
          'functionName' in serverMessage.data
        ) {
          try {
            const funcArgs = JSON.parse(serverMessage?.data?.functionArguments);
            const functionName = serverMessage?.data?.functionName as string;
            handleUpdateMessageContent(
              currentAssisstantId as string,
              `using function ${functionName} \n\n`,
              true,
            );
            functions[functionName]({ ...funcArgs, sendMessage })
              .then((response) => {
                sendMessage(
                  JSON.stringify({
                    action: 'frontend_function_result',
                    text: JSON.stringify({
                      assistantUuid: currentAssisstantId,
                      name: functionName,
                      content: response,
                    }),
                  }),
                );
              })
              .catch((e) => {
                console.error('Failed', e);
                setIsMessageStreaming(false);
                setCurrentAssisstantId(null);
              });
          } catch (e) {
            console.error(
              'failed to handle start frontend function',
              e,
              serverMessage,
            );
          }
        }
      } else if (serverMessage.type === 'start_function') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
      } else if (serverMessage.type === 'response_done') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
        setTimeout(() => {
          emit('scrollDownClicked', null);
        }, 500);
      } else if (serverMessage.type === 'response_error') {
        console.log('error handling response');
        setError(
          `Error from OpenAI API '${serverMessage.data.message}' \n\n Please try again later.`,
        );
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
        setTimeout(() => {
          emit('scrollDownClicked', null);
        }, 100);
      } else if (serverMessage.type === 'out_of_credits') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
      } else if (serverMessage.type === 'remaining_credits') {
        setRemainingCredits(serverMessage.data.remainingCredits);
      } else if (serverMessage.type == 'credit_topup') {
        console.log('serverMessage.data', serverMessage.data);
        setRemainingCredits(serverMessage.data.remainingCredits);
        emit('credit_topup', {});
      } else if (serverMessage.type === 'notebook_cache') {
        emit('notebook_cache', serverMessage.data);
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
    [sendMessage],
  );

  return {
    sendQuery,
    stopGenerating,
    regenerateLastQuery,
    error,
  };
};
