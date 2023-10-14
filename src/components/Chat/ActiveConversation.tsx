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

import { Conversation } from '@/types/chat';
import { OpenAIModelID, OpenAIModels } from '@/types/openai';

import { ChatInput } from './ChatInput';
import ConversationSettings from './ConversationSettings';
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
      handleEditConversation,
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

    const onModelSelect = useCallback(
      (model_id: string) => {
        handleEditConversation({
          ...(selectedConveration as Conversation),
          model_id: model_id,
        });
      },
      [selectedConveration],
    );
    const onChangeTemperature = useCallback(
      (temperature: number) => {
        handleEditConversation({
          ...(selectedConveration as Conversation),
          temperature: temperature,
        });
      },
      [selectedConveration],
    );

    return (
      <div className="relative flex-1 overflow-hidden dark:bg-[#343541]">
        
        {messages.length == 0 && selectedConversationId && (
          <ConversationSettings
            models={[OpenAIModels['gpt-3.5-turbo'], OpenAIModels['gpt-4']]}
            model_id={selectedConveration?.model_id as string}
            conversationId={selectedConversationId}
            onChangeTemperature={onChangeTemperature}
            onModelSelect={onModelSelect}
          />
          // ''
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
    );
  },
);

ActiveConversation.displayName = 'ActiveConversation';
export default ActiveConversation;
