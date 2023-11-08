import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Conversation } from '@/types/chat';
import { OpenAIModel, OpenAIModels } from '@/types/openai';

import ConnectNotebook from '../JupyterSettings/ConnectNotebook';
import { ModelSelect } from './ModelSelect';
import { TemperatureSlider } from './Temperature';

import { ChatContext } from '@/app/chat/chat.provider';

interface ConversationSettingsProps {}

const ConversationSettings: React.FC<ConversationSettingsProps> = ({}) => {
  const {
    state: {
      messageIsStreaming,
      selectedConversationId,
      conversations,
      messages,
    },
    handleEditConversation,
  } = useContext(ChatContext);

  const selectedConveration = useMemo(() => {
    return conversations?.find((c) => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

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
  const models = [OpenAIModels['gpt-4'], OpenAIModels['gpt-3.5-turbo'], OpenAIModels['gpt-4-1106-preview']];

  return (
    <>
      <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
        {models.length > 0 && (
          <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">
            <ModelSelect
              models={models}
              defaultModelId={OpenAIModels['gpt-4'].id}
              model_id={selectedConveration?.model_id}
              onModelSelect={onModelSelect}
            />

            <TemperatureSlider
              label={'Temperature'}
              onChangeTemperature={onChangeTemperature}
            />
            <ConnectNotebook />
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationSettings;
