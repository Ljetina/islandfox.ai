import { useEffect, useState } from 'react';

import { InitialServerData } from '@/app/chat/chat.state';

export const useInitialData = () => {
  const [initialData, setInitialData] = useState({
    conversations: [],
    folders: [],
    id: '',
    email: '',
    name: '',
    selected_tenant_id: '',
    ui_show_conversations: true,
    ui_show_prompts: true,
  } as InitialServerData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    console.log({hasFetched})
    if (!hasFetched) {
      fetch('http://localhost:3001/initial', {
        method: 'GET',
        credentials: 'include', // Include credentials to send the session cookie
      })
        .then((response) => response.json())
        .then((data) => {
          setInitialData(data);
          setIsLoading(false);
          setHasFetched(true);
        })
        .catch((error) => {
          console.log({ error });
          setIsLoading(false);
        });
    }
  }, [hasFetched, setInitialData, setIsLoading, setHasFetched]);

  return { initialData, isLoading };
};
