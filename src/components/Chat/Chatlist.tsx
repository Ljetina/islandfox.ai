// @ts-nocheck
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Message } from '@/types/chat';

import { MemoizedChatMessage } from './MemoizedChatMessage';

function makeMessages(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    content: `Message ${i}`,
  }));
}

const INITIAL_ITEM_COUNT = 50;
const TOTAL_ITEM_COUNT = 100;
const mockMessages = makeMessages(TOTAL_ITEM_COUNT);
// console.log('first', mockMessages[0]);
// console.log('last', mockMessages[mockMessages.length - 1]);

interface Props {
  totalCount: number;
  messages: Partial<Message>[];
  hasMore: boolean;
  onLoadMore: () => void;
}

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
  const totalCount = TOTAL_ITEM_COUNT * 1000;
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
  const [hasMore, setHasMore] = useState(true);
  const [messages, setMessages] = useState(
    makeInitialMessages(INITIAL_ITEM_COUNT),
  );

    // useEffect(() => {
    //   setTimeout(() => {
    //     console.log('appending');
    //     setMessages([...messages, { content: 'test', id: 'asdf' }]);
    //   }, 6000);
    // }, []);

  async function loadMore() {
    console.log('LOADING MORE');
    if (messages.length == TOTAL_ITEM_COUNT) {
      setHasMore(false);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessages(makeMoreMessages(20, messages.length).concat(messages));
  }

  console.log('wrapped messages.length', messages.length);
  return (
    <MessageList
      totalCount={totalCount}
      messages={messages}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}

export function MessageList({
  totalCount,
  hasMore,
  messages,
  onLoadMore,
}: Props) {
  // This value represents total_messages - currently_loaded_messages.
  // It's the index in the absolute list of messages relative to the
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalCount - messages.length,
  );
  console.log('messages.length', messages.length);
  const loadingMoreRef = useRef<boolean>(false);
  const initialTopMostIndexRef = useRef<number>(messages.length);
  const footerRef = useRef<HTMLDivElement>(null);
  // const prependItems = useCallback(async () => {
  //   const moreMessages = await onLoadMore();
  //   const mIds = messages.map((m) => m.id);
  //   const filteredMoreMessages = moreMessages.filter((message) => {
  //     return !mIds.includes(message.id);
  //   });
  //   const newTip = firstItemIndex - filteredMoreMessages.length;
  //   setFirstItemIndex(newTip);
  //   setMessages((list) => [...list, ...filteredMoreMessages].reverse());
  //   loadingMoreRef.current = false;
  //   return false;
  // }, [firstItemIndex, messages]);

  // const messagesEndRef = useRef<HTMLDivElement>(null);

  const Scroller = React.forwardRef(({ style, ...props }, ref) => {
    // an alternative option to assign the ref is
    // <div ref={(r) => ref.current = r}>
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

  const virtuoso = useRef(null);

  // const scrollToBottom = useCallback(() => {
  //   footerRef.current?.scrollIntoView({ behavior: 'instant' });
  // }, [inProgressFooter, messages]);

  // useEffect(() => {
  //   initialTopMostIndexRef.current = messages.length;
  //   setTimeout(() => {
  //     console.log('SCROLLING TO BOTTOM');
  //     scrollToBottom();
  //   }, 0);
  // }, [inProgressFooter]);

  /* <div
                className="h-[162px] bg-white dark:bg-[#343541]"
                ref={messagesEndRef}
              /> */
  return (
    // <div className="relative flex-1 overflow-hidden mb-128 dark:bg-[#343541]">
    <Virtuoso
      // className="relative flex-1 overflow-hidden bg-white "
      style={{ height: 'calc(100% - 122px)', scrollbarWidth: 'thin' }}
      ref={virtuoso}
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      endReached={(e) => console.log({ e })}
      startReached={(s) => {
        console.log({ s, hasMore, lmref: loadingMoreRef.current });
        if (hasMore && !loadingMoreRef.current) {
          loadingMoreRef.current = true;
          onLoadMore();
        }
      }}
      components={{
        Scroller,
      }}
      followOutput={'smooth'}
      initialTopMostItemIndex={initialTopMostIndexRef.current - 1}
      reversed={true}
      itemContent={(index) => {
        // console.log({ index });
        const localIndex = firstItemIndex + messages.length - 1 - index;
        // const reversedIndex = messages.length - 1 - localIndex;

        // const reversedIndex = totalCount - index - 1;
        const reversedIndex = messages.length - 1 - localIndex;
        // console.log({ reversedIndex });
        if (localIndex < 0) {
          console.log('zero', { localIndex, reversedIndex, firstItemIndex });
          return <p> </p>;
        } else {
          // console.log(messages.length, reversedMessages.length);
          // console.log('non-zero', {
          //   localIndex,
          //   reversedIndex,
          //   firstItemIndex,
          // });
          const message = messages[localIndex];
          // return <p>{message.id}</p>;
          return (
            <MemoizedChatMessage
              key={message.id}
              message={message as Message}
              messageIndex={index}
            />
          );
        }
        // const message = reversedMessages[reversedIndex];

        // return (
        //   <MemoizedChatMessage
        //     key={message.id}
        //     message={message as Message}
        //     messageIndex={index}
        //   />
        // );
      }}
    />
    // </div>
  );
}

function indexToMessageIndex(
  index: number,
  firstItemIndex: number,
  messagesLength: number,
) {}
