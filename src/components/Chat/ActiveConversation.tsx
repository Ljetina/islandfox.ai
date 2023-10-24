import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useEmitter } from '@/hooks/useEvents';

import ActiveConversationHeader from './ActiveConverationHeader';
import { ChatInput } from './ChatInput';
import ConversationSettings from './ConversationSettings';
import { MessageListContainer } from './MessageListContainer';
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
      },
    } = useContext(ChatContext);

    const emit = useEmitter();
    const { sendQuery, stopGenerating } = useChatter();
    const onScrollDown = useCallback(() => {
      emit('scrollDownClicked', null);
    }, [emit]);

    const [areSettingsVisible, setSettingsVisible] = useState(false);
    const [isListVisible, setListVisible] = useState(false);
    useEffect(() => {
      const handle = setTimeout(() => {
        setSettingsVisible(true);
      }, 500);
      return () => clearTimeout(handle);
    }, []);

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    useEffect(() => {
      setListVisible(false);
      const handle = setTimeout(() => {
        setListVisible(true);
      }, 500);
      return () => clearTimeout(handle);
    }, [selectedConversationId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);
    const showScrollDownButton = true;

    const onOption = useCallback(
      (option: string) => {
        sendQuery(option);
      },
      [sendQuery],
    );

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

          {areSettingsVisible &&
            messages.length == 0 &&
            selectedConversationId && <ConversationSettings />}
          <MessageListContainer />

          {!messageIsStreaming && (
            <SelectOptions options={options} onOption={onOption} />
          )}
          <div className="mb-32" />

          <ChatInput
            stopConversationRef={stopConversationRef}
            outOfCredits={remainingCredits < 100}
            textareaRef={textareaRef}
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
