import { OpenAIModel } from './openai';

export interface Message {
  // id: string,
  // conversation_id: string,
  role: Role;
  content: string | null;
  name?: string;
  function_call?: { name: string; arguments: string };
}

export type Role = 'assistant' | 'user' | 'function';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model_id: OpenAIModel;
  prompt: string;
  temperature: number;
  folder_id: string | null;
}
