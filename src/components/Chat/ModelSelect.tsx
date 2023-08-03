import { OpenAIModel } from '@/types/openai';

interface ModelSelectProps {
  models: OpenAIModel[];
  model_id?: string;
  defaultModelId: string;
  onModelSelect: (model_id: string) => void;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  models,
  model_id,
  defaultModelId,
  onModelSelect,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onModelSelect(e.target.value);

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
        Model
      </label>
      <div className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white">
        <select
          className="w-full bg-transparent p-2"
          placeholder="Select a model"
          value={model_id || defaultModelId}
          onChange={handleChange}
        >
          {models.map((model) => (
            <option
              key={model.id}
              value={model.id}
              className="dark:bg-[#343541] dark:text-white"
            >
              {model.id === defaultModelId
                ? `Default (${model.name})`
                : model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
