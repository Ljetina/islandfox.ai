import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';

import { useEvent } from '@/hooks/useEvents';

import Spinner from '../Spinner';
import { MessageVirtuoso } from './MessageVirtuoso';

import { ChatContext } from '@/app/chat/chat.provider';

export function MessageListContainer() {
  const {
    state: {
      selectedConversationId,
      messages,
      totalCount,
      firstItemIndex,
      hasMore,
      isLoadingMore,
    },
    loadMoreMessages,
  } = useContext(ChatContext);

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

  const [shouldRender, setShouldRender] = useState(true);
  const [lastConvId, setLastConvId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedConversationId !== lastConvId && isLoadingMore) {
      setShouldRender(false);
    } else if (selectedConversationId !== lastConvId && !shouldRender) {
      setShouldRender(true);
      setLastConvId(selectedConversationId);
    }
  }, [
    selectedConversationId,
    lastConvId,
    shouldRender,
    setLastConvId,
    isLoadingMore,
  ]);

  return (
    <div className="flex-grow">
      {!shouldRender && <Spinner />}
      {shouldRender && (
        <MessageVirtuoso
          virtuoso={virtuoso}
          messages={messages}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreMessages}
          firstItemIndex={firstItemIndex}
          setAtBottom={setAtBottom}
        />
      )}
    </div>
  );
}
