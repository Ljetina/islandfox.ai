import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

import { ServerMessage } from '@/types/chat';

import { useDebounce } from './useDebounce';
import { useEmitter } from './useEvents';
import { useFunctions } from './useFunctions';

import { ChatContext } from '@/app/chat/chat.provider';

export const useChatter = () => {
  const {
    state: { selectedConversationId },
    handleAddMessage,
    handleDeleteMessage,
    handleUpdateMessageContent,
    setIsMessageStreaming,
    setRemainingCredits,
  } = useContext(ChatContext);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    selectedConversationId
      ? `${process.env.NEXT_PUBLIC_WS_URL as string}/conversation/${selectedConversationId}`
      : null,
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
  const { functions } = useFunctions();

  const emit = useEmitter();

  const callCount = useRef(0);

  const onRateLimitScrollDown = useCallback(() => {
    callCount.current++;

    if (callCount.current % 20 === 0) {
      emit('scrollDownClicked', null);
    }
  }, [emit]);

  const onScrollDown = useCallback(() => {
    emit('scrollDownClicked', null);
  }, [emit]);

  const debouncedScrollDownClick = useDebounce(onScrollDown, 1000);

  useEffect(() => {
    if (lastMessage && lastHandledMessage !== lastMessage) {
      setLastHandledMessage(lastMessage);
      let serverMessage;
      try {
        serverMessage = JSON.parse(lastMessage?.data);
      } catch (e) {
        console.error('failed to parse server message', e, lastMessage.data);
        return;
      }
      // console.log(serverMessage);
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
        onRateLimitScrollDown();
      } else if (serverMessage.type === 'start_frontend_function') {
        if (
          typeof serverMessage.data == 'object' &&
          'functionName' in serverMessage.data
        ) {
          // console.log(serverMessage?.data?.functionArguments);
          try {
            const funcArgs = JSON.parse(serverMessage?.data?.functionArguments);
            // console.log({ funcArgs });
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
        // TODO fix up back-end functions
      } else if (serverMessage.type === 'response_done') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
        emit('scrollDownClicked', null);
      } else if (serverMessage.type === 'response_error') {
        console.log('error handling response');
        handleUpdateMessageContent(
          currentAssisstantId as string,
          `Error from OpenAI API '${serverMessage.data.message}' \n\n Please try again later.`,
          true,
        );
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
      } else if (serverMessage.type === 'out_of_credits') {
        setIsMessageStreaming(false);
        setCurrentAssisstantId(null);
      } else if (serverMessage.type === 'remaining_credits') {
        setRemainingCredits(serverMessage.data.remainingCredits);
      } else if (serverMessage.type == 'credit_topup') {
        console.log('serverMessage.data', serverMessage.data);
        setRemainingCredits(serverMessage.data.remainingCredits);
        emit('credit_topup', {});
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
  };
};
