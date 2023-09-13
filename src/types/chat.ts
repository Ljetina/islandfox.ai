import { OpenAIModel } from './openai';

export interface Message {
  conversation_id: string;
  created_at: string;
  updated_at: string;

  id: string;
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
  created_at: string;
  updated_at: string;
  folder_id?: string;
  name: string;
  prompt: string;
  temperature: number;
  model_id: string;
  message_count: number;
  messages: Message[]
}