import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ChatContext } from '@/app/chat/chat.provider';
import { getConversationMessages } from '@/lib/api';

export const useMoreMessages = () => {
  const {
    state: {
      messageIsStreaming,
      selectedConversationId,
      conversations,
      messages,
      totalCount,
    },
    handleAddMessagePage,
    setTotalCount,
    setFirstItemIndex,
  } = useContext(ChatContext);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const selectedConversation = useMemo(() => {
    return conversations?.find((c) => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const loadPage = useCallback(
    async ({
      page,
      limit,
    }: {
      page: number;
      limit: number;
    }): Promise<undefined> => {
      setIsLoadingMore(true);
      try {
        if (selectedConversation && !isLoadingMore) {
          const resp = await getConversationMessages({
            conversation_id: selectedConversationId as string,
            page: page,
            limit: limit,
          });
          setTotalCount(resp.pagination.total_records);
          // setFirstItemIndex()
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage((prev) => prev + 1);
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          const numAdded = handleAddMessagePage(resp.data);
          setFirstItemIndex((fii) => Math.max(fii - numAdded, 0));
        }
      } finally {
        setIsLoadingMore(false);
      }
    },
    [
      selectedConversation,
      setIsLoadingMore,
      isLoadingMore,
      setPage,
      setHasMore,
      handleAddMessagePage,
      setFirstItemIndex
    ],
  );

  useEffect(() => {
    async function loadFirstPage() {
      await loadPage({ page: 1, limit: 50 });
    }
    if (selectedConversation) {
      setHasMore(false);
      setTotalCount(selectedConversation?.message_count);
      setFirstItemIndex(selectedConversation?.message_count);
      setPage(1);
      loadFirstPage();
    }
  }, [selectedConversation, setTotalCount, setPage]);

  const loadMoreMessages = useCallback(async () => {
    return await loadPage({ page: page + 1, limit: 50 });
  }, [loadPage]);

  return {
    loadMoreMessages,
    hasMore,
    isLoadingMore,
    totalCount,
    setTotalCount,
    messages,
  };
};
