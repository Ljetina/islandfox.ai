import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
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

const INITIAL_ITEM_COUNT = 43;
const TOTAL_ITEM_COUNT = 100;
const mockMessages = makeMessages(TOTAL_ITEM_COUNT);
// console.log('first', mockMessages[0]);
// console.log('last', mockMessages[mockMessages.length - 1]);

interface Props {
  totalCount: number;
  //   initialMessages: Message[];
  messages: Partial<Message>[];
  setMessages: Dispatch<SetStateAction<{ id: string; content: string }[]>>;
  hasMore: boolean;
  onLoadMore: () => Promise<Partial<Message>[]>;
}

export default function MockedList({}) {
  const totalCount = TOTAL_ITEM_COUNT;
  function makeInitialMessages(count: number) {
    const initalMessages = [];
    for (let x = 0; x < count; ++x) {
      initalMessages.push({
        id: 'initial-id-' + x,
        content: 'Initial message ' + x,
      });
    }
    return initalMessages;
  }
  function makeMoreMessages(count: number) {
    const moreMessages = [];
    for (let x = 0; x < count; ++x) {
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

  //   useEffect(() => {
  //     setTimeout(() => {
  //       console.log('appending');
  //       setMessages([...messages, { content: 'test', id: 'asdf' }]);
  //     }, 6000);
  //   }, []);

  async function loadMore() {
    setHasMore(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return makeMoreMessages(40);
  }

  return (
    <MessageList
      totalCount={totalCount}
      messages={messages}
      setMessages={setMessages}
      hasMore={true}
      onLoadMore={loadMore}
    />
  );
}

export function MessageList({
  totalCount,
  hasMore,
  messages,
  setMessages,
  onLoadMore,
}: Props) {
  // This value represents total_messages - currently_loaded_messages.
  // It's the index in the absolute list of messages relative to the
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalCount - messages.length,
  );
  const loadingMoreRef = useRef<boolean>(false);
  const initialTopMostIndexRef = useRef<number>(messages.length);
  //   const [firstItemIndex, setFirstItemIndex] = useState(0);
  const prependItems = useCallback(async () => {
    const moreMessages = await onLoadMore();
    const messageMap = new Map();
    [...moreMessages, ...messages].forEach((message) => {
      messageMap.set(message.id, message);
    });
    console.log({ moreMessages })
    console.log('mm 0', moreMessages[0].content)
    console.log('mm -1', moreMessages[moreMessages.length - 1].content)

    console.log('cm 0', messages[0].content)
    console.log('cm -1', messages[moreMessages.length - 1].content)

    const newList = Array.from(messageMap.values());
    const messagesToPrepend = newList.length - messages.length;
    const newTip = firstItemIndex - messagesToPrepend;
    console.log({ messagesToPrepend });
    setFirstItemIndex(newTip);
    setMessages(newList);
    loadingMoreRef.current = false;
    return false;
  }, [firstItemIndex, messages]);

  return (
    <Virtuoso
      className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]"
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      endReached={(e) => console.log({ e })}
      startReached={(s) => {
        console.log({ s });
        if (hasMore && !loadingMoreRef.current) {
          loadingMoreRef.current = true;
          prependItems();
        }
      }}
      followOutput={true}
      initialTopMostItemIndex={initialTopMostIndexRef.current - 1}
      reversed={true}
      itemContent={(index) => {
        console.log({index})
        const localIndex = firstItemIndex + messages.length - 1 - index;
        // const reversedIndex = messages.length - 1 - localIndex;

        const reversedIndex = totalCount - index - 1;
        console.log({reversedIndex})
        if (localIndex < 0) {
          console.log('zero', { localIndex, reversedIndex, firstItemIndex });
          return <p> </p>;
        }
        const message = messages[reversedIndex];
        return <MemoizedChatMessage
              key={message.id}
              message={message as Message}
              messageIndex={index}
            />
      }}
    />
  );
}
