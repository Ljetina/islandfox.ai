import React, {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { Virtuoso } from 'react-virtuoso';

import { OpenAIModel, OpenAIModelID } from '@/types/openai';

import Spinner from '../Spinner/Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { MessageList } from './Chatlist';
import ConversationSettings from './ConversationSettings';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';

import { ChatContext } from '@/app/chat/chat.provider';
import { getConversationMessages } from '@/lib/api';
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

interface ActiveConversationProps {}

const ActiveConversation: React.FC<ActiveConversationProps> = memo(
  ({}: ActiveConversationProps) => {
    const modelError = null;
    //   TODO Load from API, add pagination
    // const messages: {
    //   role: Role;
    //   content: string;
    // }[] = [];
    const models: Partial<OpenAIModel>[] = [
      { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo' },
      {
        id: 'gpt-4',
        name: 'gpt-4',
      },
    ];

    const {
      state: {
        messageIsStreaming,
        selectedConversationId,
        conversations,
        messages,
      },
      // handleDeleteConversation,
      // handleSelectConversation,
      // handleEditConversation,
    } = useContext(ChatContext);
    console.log({messages})

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const reversedMessages = useMemo(() => {
      return [...messages].reverse();
    }, [messages]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const topRef = useRef<HTMLDivElement>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    // const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const stopConversationRef = useRef<boolean>(false);

    const showScrollDownButton = false;

    const [loadingNewChatMessage, setLoadingNewChatMessage] = useState(false);
    const [loadingMoreHistoric, setLoadingMoreHistoric] = useState(false);
    // edit related
    // const [currentMessage, setCurrentMessage] = useState<Message>();
    const innerDivRef = useRef<HTMLDivElement>(null);
    const prevInnerDivHeight = useRef<number | undefined>(undefined);

    // const [showMessages, setShowMessages] = useState(false);
    const [showMessages, setShowMessages] = useState(true);

    const [footer, setFooter] = useState<{
      userRequest: string;
      assistantMessage: string;
    } | null>(null);

    const scrollToBottom = useCallback(() => {
      if (messages.length == 0) {
        return;
      }
      const outerDiv = chatContainerRef.current;
      const innerDiv = innerDivRef.current;

      if (outerDiv && innerDiv) {
        const isAtBottom =
          outerDiv.scrollHeight - outerDiv.scrollTop === outerDiv.clientHeight;

        console.log({ isAtBottom });

        if (!prevInnerDivHeight.current || isAtBottom) {
          // Magic number to make sure margins are accounted for correctly
          const overscroll = 200;
          const scrollPosition =
            innerDiv.scrollHeight + overscroll - outerDiv.clientHeight;
          outerDiv.scrollTo({
            top: scrollPosition,
            left: 0,
            behavior: prevInnerDivHeight.current ? 'smooth' : 'auto',
          });
          setShowMessages(true);
        }

        prevInnerDivHeight.current = innerDiv.scrollHeight;
      }
    }, [messages]);

    const [totalCount, setTotalCount] = useState(
      selectedConveration?.message_count,
    );

    const isCancelled = useRef(false);

    const loadMoreMessages = useCallback(async () => {
      setLoadingMoreHistoric(true);
      try {
        console.log('load more', page);
        const resp = await getConversationMessages({
          conversation_id: selectedConversationId as string,
          page,
          limit: 50,
        });
        // setHasMore(false);

        if (!isCancelled.current) {
          setTotalCount(resp.pagination.total_records);
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage((prev) => prev + 1);
          } else {
            setHasMore(false);
          }
          console.log({ first: resp.data[0].content });
          return resp.data;
        }
        // TODO error handling
        console.log('missed case');
      } finally {
        console.log('in finally');
        setLoadingMoreHistoric(false);
      }
    }, [page, selectedConversationId]);

    const handleSend = async (message: string) => {
      console.log('SENDING', message);
      // setMessages((list) => [...list, ...fixedMessages]);
      setFooter({ userRequest: message, assistantMessage: '`▍`' });

      // TODO FIX!!

      // setMessages(list => [...list, fixedMessages])
      await new Promise((resolve) => setTimeout(resolve, 0));
      scrollToBottom();
      // setMessages([{role: 'assistant', content: 'TESTTEST', id: 'placeholder-response'}, message, ...messages])
      // selectedConversationId

      const controller = new AbortController();
      const response = await fetch('/api/chat/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_content: message,
          // message_content: 'please reply with the text ACK.',
          conversation_id: selectedConversationId,
        }),
        signal: controller.signal,
      });
      console.log({ response });
      if (!response.ok) {
        toast.error(response.statusText);
        return;
      }
      const data = response.body;
      if (!data) {
        toast.error('missing data on response');
        return;
      }
      setLoadingNewChatMessage(true);
      console.log('HERE x');
      // const parser = createParser(onParse);
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = '';
      // const reader = data.getReader();
      // const decoder = new TextDecoder();

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        console.log({ event });
        if (event.type === 'event') {
          console.log(event.data);
          text += event.data;
          // console.l
          try {
            setFooter({
              userRequest: message,
              assistantMessage: text + '`▍`',
            });
          } catch (e) {
            console.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      while (!done) {
        if (stopConversationRef.current === true) {
          controller.abort();
          done = true;
          break;
        }
        const { done: isDone, value } = await reader.read();
        const decoded = decoder.decode(value);
        parser.feed(decoded);
        done = isDone;
      }

      const reloadedTopMessages = await getConversationMessages({
        conversation_id: selectedConversationId as string,
        page: 0,
        limit: 2,
      });
      setFooter(null);
      //   setMessages((list) => [...reloadedTopMessages.data, ...list].reverse());
      setLoadingNewChatMessage(false);
    };

    useEffect(() => {
      scrollToBottom();
    }, [footer]);

    const START_INDEX = 1;
    const INITIAL_ITEM_COUNT = 10;

    return modelError ? (
      <ErrorMessageDiv error={modelError} />
    ) : (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        <MessageList
          totalCount={totalCount as number}
          hasMore={hasMore}
          messages={reversedMessages}
          // @ts-ignore TODO
          setMessages={() => {
            //todo
          }}
          onLoadMore={loadMoreMessages}
          inProgressFooter={footer}
        />

        <ChatInput
          stopConversationRef={stopConversationRef}
          textareaRef={textareaRef}
          onSend={handleSend}
          onScrollDownClick={() => {
            // todo
          }}
          onRegenerate={() => {
            // if (currentMessage) {
            //   handleSend(currentMessage);
            // }
          }}
          showScrollDownButton={showScrollDownButton}
          hasMessages={messages.length > 0}
          model={
            models.find(
              (m) =>
                m.id == selectedConveration?.model_id || OpenAIModelID.GPT_4,
            ) as OpenAIModel
          }
        />
      </div>
    );
  },
);

ActiveConversation.displayName = 'ActiveConversation';
export default ActiveConversation;
