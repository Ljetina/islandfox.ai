import { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

function makeMessages(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    content: `Message ${i}`,
  }));
}

const INITIAL_ITEM_COUNT = 100;
const TOTAL_ITEM_COUNT = 500;
const mockMessages = makeMessages(TOTAL_ITEM_COUNT);
console.log('first', mockMessages[0]);
console.log('last', mockMessages[mockMessages.length - 1]);

export default function List() {
  // This value represents total_messages - currently_loaded_messages.
  // It's the index in the absolute list of messages relative to the 
  const [firstItemIndex, setFirstItemIndex] = useState(400);
  const [messages, setMessages] = useState(mockMessages.slice(firstItemIndex));
  //   const [messages, setMessages] = useState(() => makeMessages(INITIAL_ITEM_COUNT));
  //   const [firstItemIndex, setFirstItemIndex] = useState(0);
  const prependItems = useCallback(() => {
    console.log('PREPENDING');
    const messagesToPrepend = 20;
    const newTip = firstItemIndex - messagesToPrepend;

    setFirstItemIndex(newTip);
    setMessages(
      mockMessages.slice(newTip, newTip + messages.length + messagesToPrepend),
    );

    return false;
  }, [firstItemIndex, messages.length]);

  console.log('total count', messages.length);
  return (
    <Virtuoso
      className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]"
      totalCount={messages.length}
      firstItemIndex={firstItemIndex}
      endReached={(e) => console.log({ e })}
      startReached={(s) => {
        console.log({ s });
        setTimeout(() => {
          prependItems();
        }, 1000);
      }}
      initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
      reversed={true}
      itemContent={(index) => {
        const localIndex = firstItemIndex + messages.length - 1 - index;
        const reversedIndex = messages.length - 1 - localIndex;
        console.log({ index, localIndex, reversedIndex });
        // const reverse_index = messages.length - 1 - index;
        // const message = messages[reverse_index];
        // if (!message) {
        //   return null;
        // }
        const message = messages[reversedIndex];
        return <div key={message.id}>{message.content}</div>;
      }}
    />
  );
}
