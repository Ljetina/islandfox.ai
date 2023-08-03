import React, { useMemo } from 'react';

import { OpenAIModelID } from '@/types/openai';

import Spinner from '../Spinner/Spinner';
import { ModelSelect } from './ModelSelect';
import { SystemPrompt } from './SystemPrompt';
import { TemperatureSlider } from './Temperature';

interface ConversationSettingsProps {
  models: Array<any>;
  model_id?: string;
  currentPrompt?: string;
  onModelSelect: (model_id: string) => void;
  onChangeSystemPrompt: (prompt: string) => void;
  onChangeTemperature: (temperature: number) => void;
}

const ConversationSettings: React.FC<ConversationSettingsProps> = ({
  models,
  model_id,
  currentPrompt,
  onModelSelect,
  onChangeSystemPrompt,
  onChangeTemperature,
}) => {
  const defaultModelId = OpenAIModelID.GPT_4;
  const selectedOrDefaultModel = useMemo(
    () => models.find((m) => m.id === (model_id || defaultModelId)),
    [model_id, models],
  );

  return (
    <>
      <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
        <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {models.length === 0 ? (
            <div>
              <Spinner size="16px" className="mx-auto" />
            </div>
          ) : (
            'IslandFox.ai'
          )}
        </div>

        {models.length > 0 && (
          <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">
            <ModelSelect
              models={models}
              defaultModelId={defaultModelId}
              model_id={model_id}
              onModelSelect={onModelSelect}
            />

            <SystemPrompt
              initialPrompt={currentPrompt || ''}
              onChangePrompt={onChangeSystemPrompt}
              model={selectedOrDefaultModel}
            />

            <TemperatureSlider
              label={'Temperature'}
              onChangeTemperature={onChangeTemperature}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationSettings;
