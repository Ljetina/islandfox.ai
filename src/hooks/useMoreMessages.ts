import { useCallback, useContext, useMemo, useState } from 'react';

import { ChatContext } from '@/app/chat/chat.provider';
import { getConversationMessages } from '@/lib/api';

export const useMoreMessages = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const {
    state: {
      messageIsStreaming,
      selectedConversationId,
      conversations,
      messages,
    },
  } = useContext(ChatContext);

  const selectedConveration = useMemo(() => {
    return conversations?.find((c) => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const loadMoreMessages = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      console.log('load more', page);

      const resp = await getConversationMessages({
        conversation_id: selectedConversationId as string,
        page,
        limit: 50,
      });
      console.log({ resp });
      // setHasMore(false);

      //   if (!isCancelled.current) {
      setTotalCount(resp.pagination.total_records);
      if (resp.pagination.current_page < resp.pagination.total_pages) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
      console.log({ first: resp.data[0].content });
      return resp.data;
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, selectedConversationId]);

  const [totalCount, setTotalCount] = useState(
    selectedConveration?.message_count,
  );

  return { loadMoreMessages, hasMore, totalCount };
};
