import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useEmitter } from '@/hooks/useEvents';

import ActiveConversationHeader from './ActiveConverationHeader';
import { ChatInput } from './ChatInput';
import ConversationSettings from './ConversationSettings';
import ErrorComponent from './Error';
import { MessageListContainer } from './MessageListContainer';
import { NotebookConnectionHeader } from './NotebookConnectionHeader';
import { SelectOptions } from './SelectOption';

import { ChatContext } from '@/app/chat/chat.provider';

interface ActiveConversationProps {
  onOpenSettings: () => void;
}

const ActiveConversation: React.FC<ActiveConversationProps> = memo(
  ({ onOpenSettings }: ActiveConversationProps) => {
    const {
      state: {
        selectedConversationId,
        conversations,
        messages,
        messageIsStreaming,
        remainingCredits,
        isLoadingMore,
      },
    } = useContext(ChatContext);

    const emit = useEmitter();
    const { sendQuery, stopGenerating, error, regenerateLastQuery } =
      useChatter();
    const onScrollDown = useCallback(() => {
      emit('scrollDownClicked', null);
    }, [emit]);

    const [content, setContent] = useState<string>('');

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);
    const showScrollDownButton = true;

    const onOption = useCallback(
      (option: string) => {
        sendQuery(option);
      },
      [sendQuery],
    );

    const onRetry = useCallback(() => {
      regenerateLastQuery();
    }, [regenerateLastQuery]);

    const options = useMemo(() => {
      if (messages.length > 0) {
        const lastMessage = messages[0];
        if (lastMessage.role == 'assistant' && lastMessage.content) {
          const optionRegex = /<option>(.*?)<\/option>/g;
          let match;
          const options = [];
          while ((match = optionRegex.exec(lastMessage.content)) !== null) {
            options.push(match[1]);
          }
          return options;
        }
      }
    }, [messages]);

    return (
      <>
        <div className="relative flex-1 overflow-hidden dark:bg-[#343541] flex flex-col">
          <ActiveConversationHeader
            selectedConversation={selectedConveration}
            handleSettings={onOpenSettings}
            onClearAll={() => console.log('clear all?')}
          />
          <NotebookConnectionHeader />

          {!isLoadingMore && messages.length == 0 && selectedConversationId && (
            <ConversationSettings />
          )}
          <MessageListContainer />

          {!messageIsStreaming && !error && (
            <SelectOptions
              options={options}
              onOption={onOption}
              disableKeys={textareaRef?.current?.value !== ''}
            />
          )}
          <ErrorComponent error={error} onRetry={onRetry} />
          <div className="mb-32" />

          <ChatInput
            stopConversationRef={stopConversationRef}
            outOfCredits={remainingCredits < 100}
            textareaRef={textareaRef}
            content={content}
            setContent={setContent}
            onSend={sendQuery}
            onScrollDownClick={onScrollDown}
            onStopGenerating={stopGenerating}
            onRegenerate={() => {
              // if (currentMessage) {
              //   handleSend(currentMessage);
              // }
            }}
            showScrollDownButton={showScrollDownButton}
            hasMessages={messages.length > 0}
          />
        </div>
      </>
    );
  },
);

ActiveConversation.displayName = 'ActiveConversation';
export default ActiveConversation;
