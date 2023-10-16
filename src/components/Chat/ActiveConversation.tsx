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
import { MessageListContainer } from './MessageListContainer';

import { ChatContext } from '@/app/chat/chat.provider';

interface ActiveConversationProps {
  onOpenSettings: () => void
}

const ActiveConversation: React.FC<ActiveConversationProps> = memo(
  ({onOpenSettings}: ActiveConversationProps) => {
    const {
      state: { selectedConversationId, conversations, messages },
    } = useContext(ChatContext);

    const emit = useEmitter();
    const { sendQuery } = useChatter();
    const onScrollDown = useCallback(() => {
      emit('scrollDownClicked', null);
    }, [emit]);

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

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

          {messages.length == 0 && selectedConversationId && (
            <ConversationSettings />
          )}
          <MessageListContainer />
          <ChatInput
            stopConversationRef={stopConversationRef}
            textareaRef={textareaRef}
            onSend={sendQuery}
            onScrollDownClick={onScrollDown}
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
