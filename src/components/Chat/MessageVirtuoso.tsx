// @ts-nocheck
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso, VirtuosoHandle, constant } from 'react-virtuoso';

// import { constant } from 'react-virtuoso'
import { Message } from '@/types/chat';

import { MemoizedChatMessage } from './MemoizedChatMessage';

interface Props {
  virtuoso: RefObject<VirtuosoHandle>;
  firstItemIndex: number;
  messages: Partial<Message>[];
  hasMore: boolean;
  isLoadingMore: boolean;
  setAtBottom: Dispatch<SetStateAction<boolean>>;
  onLoadMore: () => void;
}

export function MessageVirtuoso({
  virtuoso,
  firstItemIndex,
  hasMore,
  isLoadingMore,
  messages,
  onLoadMore,
  setAtBottom,
}: Props) {
  const initialTopMostIndexRef = useRef<number>(messages.length);

  const Header = React.forwardRef(({ style, ...props }, ref) => {
    return (
      <div
        style={{
          ...style,
          textAlign: 'center',
        }}
        ref={ref}
        {...props}
      >
        {isLoadingMore ? 'Loading...' : null}
      </div>
    );
  });

  const itemContent = useCallback(
    (index) => {
      const localIndex = firstItemIndex + messages.length - 1 - index;
      // const reversedIndex = messages.length - 1 - localIndex;
      // console.log({ index, localIndex, firstItemIndex, mlen: messages.length });
      if (localIndex < 0) {
        return <span>EMPTY&nbsp;</span>;
      } else {
        const message = messages[localIndex];
        return (
          <MemoizedChatMessage
            key={message.id}
            message={message as Message}
            messageIndex={localIndex}
          />
        );
      }
    },
    [messages],
  );

  const startReached = useCallback(async () => {
    if (!isLoadingMore && hasMore) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (messages.length == 0) {
    // Unmount to reset state
    return;
  }
  // console.log({messages})
  initialTopMostIndexRef.current = messages.length;

  return (
    <Virtuoso
      style={{ height: 'calc(100% - 122px)', scrollbarWidth: 'thin' }}
      ref={virtuoso}
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      startReached={startReached}
      components={{
        Scroller,
        Footer,
        Header,
      }}
      // atTopStateChange={}
      atBottomStateChange={setAtBottom}
      initialTopMostItemIndex={initialTopMostIndexRef.current - 1}
      // initialTopMostItemIndex={0}
      reversed={false}
      itemContent={itemContent}
    />
  );
}

const Scroller = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <div
      style={{
        ...style,
        '&::WebkitScrollbar': { width: 2 },
      }}
      ref={ref}
      {...props}
    />
  );
});
Scroller.displayName = 'Scroller';
const Footer = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <div
      style={{
        ...style,
        textAlign: 'center',
      }}
      ref={ref}
      {...props}
    ></div>
  );
});
