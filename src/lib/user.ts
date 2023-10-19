import { blurFetch } from './api';

interface UserPreferencesData {
  ui_show_prompts?: boolean;
  ui_show_conversations?: boolean;
}

export const apiUpdateUserPreferences = async (
  updatedData: Partial<UserPreferencesData>,
) => {
  return await blurFetch({
    pathname: `user`,
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
};
