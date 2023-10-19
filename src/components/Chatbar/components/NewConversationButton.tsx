import { IconPlus } from '@tabler/icons-react';
import React, { FC } from 'react';

interface NewConversationButtonProps {
  onNewConversation: () => void;
}

export const NewConversationButton: FC<NewConversationButtonProps> = ({
  onNewConversation,
}) => {
  return (
    <button
      className="text-sidebar flex w-[190px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onNewConversation}
    >
      <IconPlus size={16} />
      New chat
    </button>
  );
};
