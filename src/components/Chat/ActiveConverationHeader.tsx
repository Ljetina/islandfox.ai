import React from 'react';
import { IconSettings, IconClearAll } from '@tabler/icons-react';

interface ActiveConversationHeaderProps {
  selectedConversation: any;
  handleSettings: () => void;
  onClearAll: () => void;
}

const ActiveConversationHeader: React.FC<ActiveConversationHeaderProps> = ({
  selectedConversation,
  handleSettings,
  onClearAll,
}) => {
  return (
    <div className="sticky top-0 z-10 flex justify-center border border-b-neutral-300 bg-neutral-100 py-2 text-sm text-neutral-500 dark:border-none dark:bg-[#444654] dark:text-neutral-200">
      Model: {selectedConversation?.model_id} | Temp:{' '}
      {selectedConversation?.temperature} |
      <button
        className="ml-2 cursor-pointer hover:opacity-50"
        onClick={handleSettings}
      >
        <IconSettings size={18} />
      </button>
      <button className="ml-2 cursor-pointer hover:opacity-50" onClick={onClearAll}>
        <IconClearAll size={18} />
      </button>
    </div>
  );
};

export default ActiveConversationHeader;
