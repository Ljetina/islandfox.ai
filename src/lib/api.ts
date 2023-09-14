// Used by client components
export const getEndpoint = () => {
  return '/api/chat';
};

export const callCompletions = (messageContent: string) => {};

function makeQueryString(params: {
  [key: string]: string | number | undefined;
}) {
  if (Object.values(params).filter((v) => !!v).length > 0) {
    return (
      '?' +
      Object.entries(params)
        .map(([k, v]) => {
          console.log({ k, v });
          return `${k}=${v}`;
        })
        .join('&')
    );
  } else {
    return '';
  }
}

export async function getConversationMessages({
  conversation_id,
  page,
  limit,
}: {
  conversation_id: string;
  page: number;
  limit: number;
}) {
  const resp = await blurFetch({
    pathname: `conversation/${conversation_id}?${makeQueryString({
      page,
      limit,
    })}`,
    method: 'GET',
  });
  return await resp.json();
}

export async function loadDemoConversation() {
  const resp = await blurFetch({ pathname: 'demo/main', method: 'GET' });
  return await resp.json();
}

export const blurFetch = ({
  pathname,
  method,
  body,
}: {
  pathname: string;
  method: 'PUT' | 'GET' | 'DELETE' | 'POST';
  body?: BodyInit;
}) => {
  return fetch(`http://localhost:3001/${pathname}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body,
  });
};
