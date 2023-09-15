import { useCallback, useRef, useState } from 'react';

import { useMoreMessages } from '@/hooks/useMoreMessages';

import { MessageVirtuoso } from './MessageVirtuoso';

export function MessageListContainer() {
  const { loadMoreMessages, hasMore, totalCount, setTotalCount, messages } =
    useMoreMessages();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(totalCount);
  const [atBottom, setAtBottom] = useState(true);
  const virtuoso = useRef(null);

  console.log({messages, firstItemIndex, totalCount})

  const loadMore = useCallback(async () => {
    await loadMoreMessages();
    setFirstItemIndex(firstItemIndex - 20);
  }, [
    setIsLoadingMore,
    messages,
    firstItemIndex,
    totalCount,
    setFirstItemIndex,
    setIsLoadingMore,
  ]);

  // const addMessage = useCallback(() => {
  //   // Add one
  //   // setMessages(
  //   // [
  //   //     {
  //   //     id: '12312',
  //   //     content: 'new message ' + getRandomInt(0, 100000),
  //   //     },
  //   // ].concat(messages),
  //   // );
  //   setFirstItemIndex(firstItemIndex - 1);
  //   setTotalCount(totalCount + 1);

  //   setTimeout(() => {
  //     if (virtuoso.current) {
  //       virtuoso.current.scrollToIndex({
  //         index: messages.length - 1,
  //         align: 'end',
  //         behavior: 'smooth',
  //       });
  //     }
  //   }, 0);
  // }, [
  //   messages,
  //   setMessages,
  //   firstItemIndex,
  //   totalCount,
  //   setFirstItemIndex,
  //   setTotalCount,
  // ]);

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
    </div>
  );
}
