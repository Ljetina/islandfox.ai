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

    return (
      <>
        <div className="relative flex-1 overflow-hidden dark:bg-[#343541]">
          <ActiveConversationHeader
            selectedConversation={selectedConveration}
            handleSettings={onOpenSettings}
            onClearAll={() => console.log('clear all?')}
          />

          {areSettingsVisible &&
            messages.length == 0 &&
            selectedConversationId && <ConversationSettings />}
          <MessageListContainer />
          

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
