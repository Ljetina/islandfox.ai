import React, { memo, useCallback, useContext, useMemo, useRef } from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useEmitter } from '@/hooks/useEvents';
import { useMoreMessages } from '@/hooks/useMoreMessages';

import { OpenAIModel, OpenAIModelID } from '@/types/openai';

import { ChatInput } from './ChatInput';
import { MockedList } from './ListTest';
import { MessageListContainer } from './MessageListContainer';
import { MessageVirtuoso } from './MessageVirtuoso';

import { ChatContext } from '@/app/chat/chat.provider';
import ConversationSettings from './ConversationSettings';

interface ActiveConversationProps {}

const ActiveConversation: React.FC<ActiveConversationProps> = memo(
  ({}: ActiveConversationProps) => {
    const {
      state: {
        messageIsStreaming,
        selectedConversationId,
        conversations,
        messages,
      },
    } = useContext(ChatContext);

    const emit = useEmitter();
    const onScrollDown = useCallback(() => {
      emit('scrollDownClicked', null);
    }, [emit])

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);
    const showScrollDownButton = true;
    const { sendQuery } = useChatter();

    return (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        {/* {messages.length > 0 ? <MessageListContainer /> : <ConversationSettings models={Object.values(OpenAIModelID)} />} */}
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
    );
  },
);

ActiveConversation.displayName = 'ActiveConversation';
export default ActiveConversation;
