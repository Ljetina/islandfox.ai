import { useCallback, useRef, useState } from 'react';

import { MessageVirtuoso } from './MessageVirtuoso';

function makeMessages(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    content: `Message ${i}`,
  }));
}

const INITIAL_ITEM_COUNT = 10;
const TOTAL_ITEM_COUNT = 10;
const mockMessages = makeMessages(TOTAL_ITEM_COUNT);

export const ListTest = () => {
  return (
    <div>
      <MockedList />
    </div>
  );
};

export function SimpleList({ messages }: any) {
  console.log({ messages });
  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>{m.content}</li>
      ))}
    </ul>
  );
}

export function MockedList({}) {
  const [totalCount, setTotalCount] = useState(TOTAL_ITEM_COUNT);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [messages, setMessages] = useState(
    makeInitialMessages(INITIAL_ITEM_COUNT),
  );
  const [firstItemIndex, setFirstItemIndex] = useState(totalCount);
  const [atBottom, setAtBottom] = useState(true);
  const virtuoso = useRef(null);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    if (messages.length >= totalCount) {
      setHasMore(false);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    setMessages(messages.concat(makeMoreMessages(20, messages.length)));
    setFirstItemIndex(firstItemIndex - 20);
    setIsLoadingMore(false);
  }, [
    setIsLoadingMore,
    setHasMore,
    setMessages,
    messages,
    firstItemIndex,
    totalCount,
    setFirstItemIndex,
    setIsLoadingMore,
  ]);

  const addMessage = useCallback(() => {
    setMessages(
      [
        {
          id: '12312',
          content: 'new message ' + getRandomInt(0, 100000),
        },
      ].concat(messages),
    );
    setFirstItemIndex(firstItemIndex - 1);
    setTotalCount(totalCount + 1);

    setTimeout(() => {
      if (virtuoso.current && !atBottom) {
        virtuoso.current.scrollToIndex({
          // messages.length instead of -1, because the m
          index: messages.length,
          align: 'end',
          behavior: 'smooth',
        });
      }
    }, 100);
  }, [
    messages,
    setMessages,
    firstItemIndex,
    totalCount,
    setFirstItemIndex,
    setTotalCount
  ]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageVirtuoso
        virtuoso={virtuoso}
        messages={messages}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        firstItemIndex={firstItemIndex}
        setAtBottom={setAtBottom}
      />
      <button style={buttonStyle} onClick={addMessage}>
        Click me
      </button>
    </div>
  );
}

const buttonStyle = {
  position: 'fixed',
  bottom: '200px',
  right: '20px',
  backgroundColor: '#008CBA', // Change as needed
  color: 'white', // Change as needed
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '5px',
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeInitialMessages(count: number) {
  const initialMessages = [];
  for (let x = 0; x < count; ++x) {
    initialMessages.push({
      id: 'initial-id-' + x,
      content: 'Initial message ' + x,
    });
  }
  return initialMessages;
}
function makeMoreMessages(count: number, starting_index = 0) {
  const moreMessages = [];
  for (let x = starting_index; x < count + starting_index; ++x) {
    moreMessages.push({
      id: 'more-id-' + x,
      content: 'More message ' + x,
    });
  }
  return moreMessages;
}
