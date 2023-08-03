import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderType } from '@/types/folder';

import { ChatInitialState } from './chat.state';

export interface ChatContextProps {
  state: ChatInitialState;
  dispatch: Dispatch<ActionType<ChatInitialState>>;
  // TODO Fix up these, maybe move them lower? Not too sure yet
  // handleNewConversation: () => void;
  // handleCreateFolder: (name: string, type: FolderType) => void;
  // handleDeleteFolder: (folderId: string) => void;
  // handleUpdateFolder: (folderId: string, name: string) => void;
  // handleSelectConversation: (conversation: Conversation) => void;
  // handleUpdateConversation: (
  //   conversation: Conversation,
  //   data: KeyValuePair,
  // ) => void;
}

const ChatContext = createContext<ChatContextProps>(undefined!);

export default ChatContext;
