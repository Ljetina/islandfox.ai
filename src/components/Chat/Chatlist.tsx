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
import { Virtuoso, constant } from 'react-virtuoso';

// import { constant } from 'react-virtuoso'
import { Message } from '@/types/chat';

import { MemoizedChatMessage } from './MemoizedChatMessage';

interface Props {
  virtuoso: RefObject;
  firstItemIndex: number;
  messages: Partial<Message>[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function MessageList({
  virtuoso,
  firstItemIndex,
  hasMore,
  isLoadingMore,
  messages,
  onLoadMore,
}: Props) {
  // This value represents total_messages - currently_loaded_messages.
  // It's the index in the absolute list of messages relative to the
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

  useEffect(() => {
    // virtuoso.current.scrollToIndex({
    //   index: messages.length - 1,
    //   align: 'end',
    //   behavior: 'smooth',
    // });
  }, [messages]);

  return (
    <Virtuoso
      style={{ height: 'calc(100% - 122px)', scrollbarWidth: 'thin' }}
      ref={virtuoso}
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      endReached={(e) => {
        console.log({ e });
      }}
      startReached={async (s) => {
        console.log({ s, hasMore, lmref: isLoadingMore });
        if (hasMore && !isLoadingMore) {
          onLoadMore();
        }
      }}
      components={{
        Scroller,
        Footer,
        Header,
      }}
      initialTopMostItemIndex={initialTopMostIndexRef.current - 1}
      reversed={true}
      itemContent={(index) => {
        const localIndex = firstItemIndex + messages.length - 1 - index;
        const reversedIndex = messages.length - 1 - localIndex;
        if (localIndex < 0) {
          return <span>'&nbsp;</span>;
        } else {
          const message = messages[localIndex];
          return (
            <MemoizedChatMessage
              key={message.id}
              message={message as Message}
              messageIndex={index}
            />
          );
        }
      }}
    />
  );
}

const Scroller = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <div
      style={{
        ...style,
        border: '5px solid gray',
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

// function indexToMessageIndex(
//   index: number,
//   firstItemIndex: number,
//   messagesLength: number,
// ) {}

// const scrollToBottom = useCallback(() => {
//   virtuoso.current.scrollToIndex({
//     align: 'end',
//     behavior: 'smooth',
//     index: messages.length - 1,
//   });
//   // footerRef.current?.scrollIntoView({ behavior: 'instant' });
// }, [messages, virtuoso]);

// const [atBottom, setAtBottom] = useState(true);
