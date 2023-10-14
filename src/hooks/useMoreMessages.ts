import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ChatContext } from '@/app/chat/chat.provider';
import { getConversationMessages } from '@/lib/api';

export const useMoreMessages = () => {
  const {
    state: { selectedConversationId, messages, totalCount },
    handleAddMessagePage,
    setTotalCount,
    setFirstItemIndex,
  } = useContext(ChatContext);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastInitConvId, setLastInitConvId] = useState<string | null>(null);

  const loadPage = useCallback(
    async (
      {
        page,
        limit,
      }: {
        page: number;
        limit: number;
      },
      replace?: boolean,
    ): Promise<undefined> => {
      try {
        if (selectedConversationId) {
          setIsLoadingMore(true);
          const resp = await getConversationMessages({
            conversation_id: selectedConversationId,
            page: page,
            limit: limit,
          });
          setTotalCount(resp.pagination.total_records);
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage(page);
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          const numAdded = handleAddMessagePage(resp.data, replace);
          if (!replace) {
            setFirstItemIndex((fii) => Math.max(fii - numAdded, 0));
          }
        }
      } finally {
        setIsLoadingMore(false);
      }
    },
    [selectedConversationId, handleAddMessagePage],
  );

  useEffect(() => {
    async function loadFirstPage() {
      await loadPage({ page: 1, limit: 50 }, true);
    }
    if (selectedConversationId && lastInitConvId !== selectedConversationId) {
      setLastInitConvId(selectedConversationId);
      setHasMore(false);
      loadFirstPage();
    }
  }, [selectedConversationId]);

  const loadMoreMessages = useCallback(async () => {
    return await loadPage({ page: page + 1, limit: 50 });
  }, [loadPage, page]);

  return {
    loadMoreMessages,
    hasMore,
    isLoadingMore,
    totalCount,
    setTotalCount,
    messages,
  };
};
