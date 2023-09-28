import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';

import { useEvent } from '@/hooks/useEvents';
import { useMoreMessages } from '@/hooks/useMoreMessages';

import { MessageVirtuoso } from './MessageVirtuoso';

import { ChatContext } from '@/app/chat/chat.provider';

export function MessageListContainer() {
  const { loadMoreMessages, hasMore, totalCount, messages, isLoadingMore } = useMoreMessages();
  
  const [atBottom, setAtBottom] = useState(true);
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEvent('scrollDownClicked', () => {
    if (virtuoso) {
      virtuoso.current?.scrollToIndex({
        index: totalCount - 1,
        align: 'end',
        behavior: 'smooth',
      });
    }
  });

  const {
    state: { firstItemIndex },
  } = useContext(ChatContext);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageVirtuoso
        virtuoso={virtuoso}
        messages={messages}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMoreMessages}
        firstItemIndex={firstItemIndex}
        setAtBottom={setAtBottom}
      />
    </div>
  );
}
