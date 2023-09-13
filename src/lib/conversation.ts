import { Conversation } from '@/types/chat';

import { blurFetch } from './api';

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
    console.log(data);
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
