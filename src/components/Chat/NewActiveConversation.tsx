import React, { memo, useContext, useMemo, useRef } from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useMoreMessages } from '@/hooks/useMoreMessages';

import { OpenAIModel, OpenAIModelID } from '@/types/openai';

import { ChatInput } from './ChatInput';
import { MessageVirtuoso } from './MessageVirtuoso';
import { MockedList } from './ListTest';
import { MessageListContainer } from './MessageListContainer';

import { ChatContext } from '@/app/chat/chat.provider';

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

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);
    const showScrollDownButton = true;
    const { sendQuery } = useChatter();

    return (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        <MessageListContainer />
        {/* <MockedList /> */}
        {/* <MessageList
          totalCount={totalCount as number}
          hasMore={hasMore}
          messages={messages}
          onLoadMore={loadMoreMessages}
        /> */}

        <ChatInput
          stopConversationRef={stopConversationRef}
          textareaRef={textareaRef}
          onSend={sendQuery}
          onScrollDownClick={() => {
            // todo
          }}
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
