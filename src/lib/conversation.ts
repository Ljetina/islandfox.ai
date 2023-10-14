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
    const response = await blurFetch({
      pathname: 'conversation',
      method: 'POST',
      body: JSON.stringify(newConversationData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
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
    const response = await blurFetch({
      pathname: `conversation/${conversationId}/notebook`,
      method: 'GET',
    });
    const data = await response.json();
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
    const response = await blurFetch({
      pathname: `user/notebook`,
      method: 'POST',
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const apiUpdateConversation = async (
  conversationId: string,
  updatedData: Partial<ConversationData>,
) => {
  try {
    const response = await blurFetch({
      pathname: `conversation/${conversationId}`,
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
