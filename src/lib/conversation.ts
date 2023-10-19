import { Conversation } from '@/types/chat';

import { blurFetch } from './api';
import { JupyterConversationSettings, JupyterGlobalSettings } from './jupyter';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations,
  };
};

export const saveConversation = (conversation: Conversation) => {
  localStorage.setItem('selectedConversation', JSON.stringify(conversation));
};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};

interface ConversationData {
  name: string;
  prompt: string;
  model_id: string;
  temperature: number;
  folder_id?: string;
}

export const apiCreateConversation = async (
  newConversationData: ConversationData,
) => {
  try {
    const data = await blurFetch({
      pathname: 'conversation',
      method: 'POST',
      body: JSON.stringify(newConversationData),
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const apiGetConversationNotebookSettings = async (
  conversationId: string,
): Promise<{
  notebook_path: string | undefined;
  notebook_name: string | undefined;
  session_id: string | undefined;
  kernel_id: string | undefined;
}> => {
  try {
    const data = await blurFetch({
      pathname: `conversation/${conversationId}/notebook`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Error: ', error);
  }
  return {
    notebook_path: undefined,
    notebook_name: undefined,
    session_id: undefined,
    kernel_id: undefined,
  };
};

export const apiSaveConversationNotebookSettings = async (
  conversationSettings: Partial<JupyterConversationSettings>,
) => {
  try {
    await blurFetch({
      pathname: `conversation/${conversationSettings.conversation_id}/notebook`,
      method: 'POST',
      body: JSON.stringify(conversationSettings),
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const apiSaveNotebookSettings = async (
  settings: JupyterGlobalSettings,
) => {
  try {
    return await blurFetch({
      pathname: `user/notebook`,
      method: 'POST',
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const apiUpdateConversation = async (
  conversationId: string,
  updatedData: Partial<ConversationData>,
) => {
  try {
    return await blurFetch({
      pathname: `conversation/${conversationId}`,
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

export const apiDeleteConversation = async (conversationId: string) => {
  try {
    const response = await blurFetch({
      pathname: `conversation/${conversationId}`,
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
