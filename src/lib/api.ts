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
  page?: number;
  limit?: number;
}) {
  let query = makeQueryString({ page, limit });
  console.log({
    url: `/api/conversations/${conversation_id}/messages${query}`,
  });
  const res = await fetch(
    `/api/conversations/${conversation_id}/messages${query}`,
  );
  return await res.json();
}

export async function sendChatMessage({
  conversationId,
  content,
}: {
  conversationId: string;
  content: string;
}) {
  const controller = new AbortController();
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    // @ts-ignore TODO
    body,
  });
  return {
    response,
    controller,
  };
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
