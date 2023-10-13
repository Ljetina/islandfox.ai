import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useChatter } from '@/hooks/useChatter';
import { useEmitter } from '@/hooks/useEvents';

import { Conversation } from '@/types/chat';
import { OpenAIModelID, OpenAIModels } from '@/types/openai';

import { ChatInput } from './ChatInput';
import ConversationSettings from './ConversationSettings';
import { MessageListContainer } from './MessageListContainer';

import { ChatContext } from '@/app/chat/chat.provider';
import { getAvailableNotebookOptions } from '@/lib/jupyter';

interface ActiveConversationProps {}

const ActiveConversation: React.FC<ActiveConversationProps> = memo(
  ({}: ActiveConversationProps) => {
    const {
      state: {
        messageIsStreaming,
        selectedConversationId,
        conversations,
        messages,
        jupyterSettings,
      },
      handleEditConversation,
    } = useContext(ChatContext);

    useEffect(() => {
      (async () => {
        if (jupyterSettings.host !== '') {
          const resp = await getAvailableNotebookOptions(jupyterSettings);
          console.log({ resp });
        }
      })();
    }, [jupyterSettings, selectedConversationId]);

    const emit = useEmitter();
    const onScrollDown = useCallback(() => {
      emit('scrollDownClicked', null);
    }, [emit]);

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);
    const showScrollDownButton = true;
    const { sendQuery } = useChatter();

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
        {messages.length > 0 ? (
          <MessageListContainer />
        ) : !!selectedConversationId ? (
          <ConversationSettings
            models={[OpenAIModels['gpt-3.5-turbo'], OpenAIModels['gpt-4']]}
            model_id={selectedConveration?.model_id as string}
            conversationId={selectedConversationId}
            onChangeTemperature={onChangeTemperature}
            onModelSelect={onModelSelect}
          />
        ) : null}
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
