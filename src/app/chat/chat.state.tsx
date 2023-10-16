import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { PluginKey } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

export type ChatInitialState = ClientState;

// Rework of state, ignore the other states below
export interface ClientState {
  conversations: Conversation[];
  messages: Message[];
  ui_show_prompts: boolean;
  ui_show_conversations: boolean;
  selected_conversation_id?: string;
}
// export interface ClientState {
//   loading: boolean;
//   // lightMode: 'light' | 'dark';
//   // messageIsStreaming: boolean;
//   // modelError: ErrorMessage | null;
//   selectedConversationId?: string | undefined;
//   // currentFolder: FolderInterface | undefined;
//   // currentMessage: Message | undefined;
//   // messageError: boolean;
//   // searchTerm: string;
// }

export const initialState: ClientState = {
  conversations: [],
  messages: [],
  ui_show_conversations: false,
  ui_show_prompts: false,
  // loading: false,
  // lightMode: 'dark',
  // messageIsStreaming: false,
  // modelError: null,
  // currentFolder: undefined,
  // currentMessage: undefined,
  // messageError: false,
  // searchTerm: '',
};

export interface InitialServerData {
  id: string;
  email: string;
  name: string;
  ui_show_prompts: boolean;
  ui_show_conversations: boolean;
  selected_tenant_id: string;
  jupyter_settings: {
    host: string;
    port: string;
    token: string;
    notebooks_folder_path: string;
  };
  conversations?: Conversation[];
  folders?: {
    id: string;
    name: string;
  }[];
  tenant_credits: number;
}
