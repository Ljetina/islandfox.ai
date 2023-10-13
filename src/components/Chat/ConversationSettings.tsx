import React, { useContext, useEffect, useState } from 'react';

import { OpenAIModel } from '@/types/openai';

import ConnectNotebook from '../JupyterSettings/ConnectNotebook';
import { ModelSelect } from './ModelSelect';
import { TemperatureSlider } from './Temperature';

import { ChatContext } from '@/app/chat/chat.provider';

interface ConversationSettingsProps {
  models: Array<OpenAIModel>;
  model_id: string;
  conversationId: string;
  currentPrompt?: string;
  onModelSelect: (model_id: string) => void;
  onChangeTemperature: (temperature: number) => void;
}

const ConversationSettings: React.FC<ConversationSettingsProps> = ({
  models,
  model_id,
  onModelSelect,
  onChangeTemperature,
  conversationId,
}) => {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setTimeout(() => {
        setFirstRender(false);
      }, 500);
    }
  }, [firstRender, setFirstRender]);
  if (!conversationId || firstRender) {
    return;
  }
  return (
    <>
      <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
        <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
          IslandFox.ai
        </div>

        {models.length > 0 && (
          <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">
            <ModelSelect
              models={models}
              defaultModelId={model_id}
              model_id={model_id}
              onModelSelect={onModelSelect}
            />

            <TemperatureSlider
              label={'Temperature'}
              onChangeTemperature={onChangeTemperature}
            />
            <ConnectNotebook conversationId={conversationId} />
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationSettings;
