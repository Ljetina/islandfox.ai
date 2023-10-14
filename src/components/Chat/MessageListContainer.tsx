import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';

import { useEvent } from '@/hooks/useEvents';
import { useMoreMessages } from '@/hooks/useMoreMessages';

import { MessageVirtuoso } from './MessageVirtuoso';

import { ChatContext } from '@/app/chat/chat.provider';

export function MessageListContainer() {
  const { loadMoreMessages, hasMore, totalCount, messages, isLoadingMore } =
    useMoreMessages();

  const [atBottom, setAtBottom] = useState(true);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const onDown = useCallback(() => {
    if (virtuoso) {
      virtuoso.current?.scrollToIndex({
        index: totalCount - 1,
        align: 'end',
        behavior: 'smooth',
      });
    }
  }, [virtuoso, totalCount]);

  useEvent('scrollDownClicked', onDown);

  const {
    state: { firstItemIndex, selectedConversationId },
  } = useContext(ChatContext);

  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setShouldRender(false);
    setTimeout(() => setShouldRender(true), 0);
  }, [selectedConversationId]);

  // If shouldRender is false, return null
  if (!shouldRender) {
    return null;
  }

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
