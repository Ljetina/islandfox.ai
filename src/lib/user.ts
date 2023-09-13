import { blurFetch } from './api';

interface UserPreferencesData {
  ui_show_prompts?: boolean;
  ui_show_conversations?: boolean;
}

export const apiUpdateUserPreferences = async (
  updatedData: Partial<UserPreferencesData>,
) => {
  try {
    const response = await blurFetch({
      pathname: `user`,
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
