import { emitEvent } from './events';

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
  return await blurFetch({
    pathname: `conversation/${conversation_id}/message${makeQueryString({
      page,
      limit,
    })}`,
    method: 'GET',
  });
}

export async function loadDemoConversation() {
  return await blurFetch({ pathname: 'demo/main', method: 'GET' });
}

export const blurFetch = async ({
  pathname,
  method,
  body,
}: {
  pathname: string;
  method: 'PUT' | 'GET' | 'DELETE' | 'POST';
  body?: BodyInit;
}) => {
  try {
    const resp = await fetch(`http://localhost:3001/${pathname}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body,
    });

    const responseBody = resp.status !== 204 ? await resp.json() : '';
    if (resp.ok) {
      return responseBody
    } else {
      if ([401, 403].includes(resp.status)) {
        emitEvent('logged_out');
      }
      throw Error('failed to fetch');
    }
  } catch (e) {
    // e.
    console.error('blur fetch', e);
    throw e;
  }
};
