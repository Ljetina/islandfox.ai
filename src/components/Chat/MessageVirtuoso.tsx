import React, {
  Component,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

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

  const [atTop, setAtTop] = useState(false);
  const [loadMoreDelayPassed, setLoadMoreDelayPassed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoadMoreDelayPassed(true);
    }, 1000);
  }, []);

  // @ts-ignore
  const Header = React.forwardRef(({ style, ...props }, ref) => {
    return (
      <div
        style={{
          ...style,
          textAlign: 'center',
        }}
        // @ts-ignore
        ref={ref}
        {...props}
      >
        {isLoadingMore ? 'Loading...' : null}
      </div>
    );
  });

  const itemContent = useCallback(
    (index: number) => {
      const localIndex = firstItemIndex + messages.length - 1 - index;
      // const reversedIndex = messages.length - 1 - localIndex;
      // console.log({ index, localIndex, firstItemIndex, mlen: messages.length });
      if (localIndex < 0) {
        return <span>EMPTY&nbsp;</span>;
      } else {
        const message = messages[localIndex];
        if (!message) {
          return '';
        }
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

  const atTopStateChange = useCallback(
    (state: boolean) => {
      if (state !== atTop && messages.length > 0 && loadMoreDelayPassed) {
        setAtTop(state);
        if (state) {
          startReached();
        }
      }
    },
    [atTop, setAtTop, startReached, messages, loadMoreDelayPassed],
  );

  initialTopMostIndexRef.current = messages.length;

  return (
    <Virtuoso
      style={{ height: 'calc(100% - 122px)', scrollbarWidth: 'thin' }}
      ref={virtuoso}
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      components={{
        // @ts-ignore
        Scroller,
        // @ts-ignore
        Footer,
        // @ts-ignore
        Header,
      }}
      atTopStateChange={atTopStateChange}
      atBottomStateChange={setAtBottom}
      initialTopMostItemIndex={initialTopMostIndexRef.current - 1}
      reversed={false}
      itemContent={itemContent}
    />
  );
}

const Scroller = React.forwardRef<HTMLDivElement | null>(
  // @ts-ignore
  ({ style, ...props }, ref) => {
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
  },
);
Scroller.displayName = 'Scroller';

const Footer = React.forwardRef<HTMLDivElement | null>(
  // @ts-ignore
  ({ style, ...props }, ref) => {
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
  },
);
