import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { PluginKey } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

export type ChatInitialState = InitialServerData & ClientState;
export interface ClientState {
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  selectedConversationId?: string | undefined;
  currentFolder: FolderInterface | undefined;
  currentMessage: Message | undefined;
  messageError: boolean;
  searchTerm: string;
}

export interface InitialServerData {
  id: string;
  email: string;
  name: string;
  ui_show_prompts: boolean;
  ui_show_conversations: boolean;
  selected_tenant_id: string;
  conversations?: {
    id: string;
    created_at: string;
    updated_at: string;
    folder_id?: string;
    name: string;
    prompt: string;
    temperature: number;
    model_id: string;
    message_count: number;
    messages: Message[]
  }[];
  folders?: {
    id: string;
    name: string;
  }[];
}

export const initialState: ClientState = {
  loading: false,
  lightMode: 'dark',
  messageIsStreaming: false,
  modelError: null,
  currentFolder: undefined,
  currentMessage: undefined,
  messageError: false,
  searchTerm: '',
};
