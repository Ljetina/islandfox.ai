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

import { useFetch } from '@/hooks/useFetch';

import { Message, Role } from '@/types/chat';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';

import Spinner from '../Spinner/Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import ConversationSettings from './ConversationSettings';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';
import { MessageList } from './Chatlist';

import ChatContext from '@/app/chat/chat.context';
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

    // const selectedConversationId = '9d866b4f-03f3-4d9c-b423-4c0a4f8f11b8';
    const selectedConversationId = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0';
    // const selectedConversationId = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0';
    const {
      state: {
        // selectedConversationId,
        conversations,
        //   models,
      },
      // handleUpdateConversation,
      dispatch: homeDispatch,
    } = useContext(ChatContext);

    const selectedConveration = useMemo(() => {
      return conversations?.find((c) => c.id === selectedConversationId);
    }, [conversations, selectedConversationId]);

    const [messages, setMessages] = useState(
      [...selectedConveration?.messages || []].reverse(),
      //   [],
    );

    const reversedMessages = useMemo(() => {
      return messages.reverse();
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

    const [showMessages, setShowMessages] = useState(false);

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

    // useEffect(() => {
    //   scrollToBottom();
    // }, [messages]);

    // useEffect(() => {
    //   console.log('USE EFFECT', messages);
    //   if (initialLoad && messagesEndRef) {
    //     setInitialLoad(false);
    //     setTimeout(() => {
    //       // messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    //     });
    //   }
    // }, [messages, messagesEndRef]);
    const isCancelled = useRef(false);

    // Virtuoso related
    console.log({ selectedConveration });
    const [totalCount, setTotalCount] = useState(
      selectedConveration?.message_count,
    );
    console.log('totalCount', totalCount);
    const [firstItemIndex, setFirstItemIndex] = useState(
      (totalCount as number) -
        (selectedConveration?.messages?.length as number),
    );

    const loadMoreMessages = useCallback(async () => {
      setLoadingMoreHistoric(true);
      try {
        const resp = await getConversationMessages({
          conversation_id: selectedConversationId,
          page,
          limit: 50,
        });
        if (!isCancelled.current) {
          setTotalCount(resp.pagination.total_records);
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage((prev) => prev + 1);
          } else {
            setHasMore(false);
          }
          return resp.data;
        }
        // TODO error handling
        console.log('missed case');
      } finally {
        setLoadingMoreHistoric(false);
      }
    }, [page, selectedConversationId]);

    // const loadMessages = useCallback(async () => {
    //   setLoadingMoreHistoric(true);
    //   try {
    //     const resp = await getConversationMessages({
    //       conversation_id: selectedConversationId,
    //       page,
    //       limit: 50,
    //     });
    //     if (!isCancelled.current) {
    //       setTotalCount(resp.pagination.total_records);
    //       if (resp.pagination.current_page < resp.pagination.total_pages) {
    //         setPage((prev) => prev + 1);
    //       } else {
    //         setHasMore(false);
    //       }
    //       // setTimeout(() => {
    //       //   chatContainerRef.current?.scrollBy({ top: 20 });
    //       // }, 2000);
    //       setMessages((prev) => {
    //         const messageMap = new Map();
    //         [...resp.data, ...prev].forEach((message) => {
    //           messageMap.set(message.id, message);
    //         });
    //         const newList = Array.from(messageMap.values());
    //         const newTip = firstItemIndex - (messages.length - newList.length);
    //         console.log('setting fii', newList.length - prev.length);
    //         // setFirstItemIndex(newList.length - prev.length);
    //         return newList;
    //       });
    //       // setTimeout(() => {

    //       // }, 4000);
    //     }
    //   } finally {
    //     setLoadingMoreHistoric(false);
    //   }
    // }, [setPage, setHasMore, setMessages, setLoadingMoreHistoric, page]);

    useEffect(() => {
      isCancelled.current = false;
      setTimeout(() => {
        // console.log('NOT LOADING FROM SELECTED ID EFFECT');
        // loadMessages();
      }, 5000);
      // console.log('LOADING FROM SELECTED ID EFFECT');
      // loadMessages();
      return () => {
        isCancelled.current = true;
      };
    }, [selectedConversationId]);


    const handleScroll = () => {
      // TODO
    };

    const handleScrollDown = () => {
      // TODO
    };

    const handleSend = async (message: string) => {
      console.log('SENDING', message);
      const updatedMessages = [
        {
          role: 'assistant',
          content: '`▍`',
          id: 'placeholder-response',
        },
        {
          role: 'user',
          content: message,
          id: 'placeholder-requests',
        },
        ...messages,
      ];
      setMessages(updatedMessages);
      await new Promise((resolve) => setTimeout(resolve, 0));
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
          const messageFromChunk = {
            ...updatedMessages[0],
            content: text + (done ? '' : '`▍`'),
          };
          setMessages([messageFromChunk, ...updatedMessages.slice(1)]);
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
        conversation_id: selectedConversationId,
        page: 0,
        limit: 2,
      });
      setMessages([...reloadedTopMessages.data, ...updatedMessages.slice(2)]);
      setLoadingNewChatMessage(false);
    };

    const handleEditMessage = () => {
      // onEdit={(editedMessage) => {
      //   setCurrentMessage(editedMessage);
      //   // discard edited message and the ones that come after then resend
      //   handleSend(
      //     editedMessage,
      //     selectedConversation?.messages.length - index,
      //   );
      // }}
    };

    const updateConversationSettings = useCallback(
      (field: string) => (value: string | number) => {
        console.log('TODO implement updateConversationSettings');
      },
      [],
    );

    const handleUpdateConversation = () => {};

    const START_INDEX = 1;
    const INITIAL_ITEM_COUNT = 10;

    console.log('on render, ml', messages.length);
    console.log('on render, first', messages[0]);
    return (
      <MessageList
        totalCount={totalCount as number}
        hasMore={hasMore}
        messages={messages}
        setMessages={setMessages}
        onLoadMore={loadMoreMessages}
      />
    );
    return modelError ? (
      <ErrorMessageDiv error={modelError} />
    ) : (
      <Virtuoso
        className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]"
        totalCount={messages.length}
        firstItemIndex={firstItemIndex}
        // firstItemIndex={0}
        startReached={(s) => console.log({ s })}
        endReached={(e) => console.log({ e })}
        initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
        reversed={true}
        // itemContent={index => <div>Item {messages[messages.length - 1 - index].content}</div>} />
        itemContent={(index) => {
          const localIndex = firstItemIndex + messages.length - 1 - index;
          const reversedIndex = messages.length - 1 - localIndex;
          // const reverse_index = messages.length - 1 - index + firstItemIndex;
          const message = messages[localIndex];
          console.log('ml', messages.length);
          console.log('ri', reversedIndex);
          console.log('ni', index);
          console.log('fii', firstItemIndex);
          if (!message) {
            return null;
          }
          return (
            <MemoizedChatMessage
              key={message.id}
              message={message}
              messageIndex={index}
            />
          );
          // const reverse_index = messages.length - 1 - index
          // return <div>Item {.content} {messages[index].content}</div>
          // return <div>Item {reverse_index} {index}</div>
        }}
      />
    );
    return;
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
      <div
        className="h-full overflow-auto"
        // style={{marginBottom: "300px"}}
        // className="max-h-full overflow-auto flex flex-col-reverse"
        // className="h-50 overflow-auto flex flex-col-reverse"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <ConversationSettings
            currentPrompt={selectedConveration?.prompt}
            models={models}
            model_id={selectedConveration?.model_id}
            onChangeSystemPrompt={updateConversationSettings('prompt')}
            onModelSelect={updateConversationSettings('model_id')}
            onChangeTemperature={updateConversationSettings('temperature')}
          />
        ) : (
          <div
            className="relative transition-all duration-300"
            style={{ opacity: showMessages ? 1 : 0 }}
            ref={innerDivRef}
          >
            <div
              ref={topRef}
              className={`h-10 flex items-center justify-center ${
                loadingMoreHistoric ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Spinner />
            </div>
            {messages
              .slice()
              .reverse()
              .map((message, index) => (
                <MemoizedChatMessage
                  key={message.id}
                  message={message}
                  messageIndex={index}
                />
              ))}

            {loadingNewChatMessage || (loadingNewChatMessage && <ChatLoader />)}
          </div>
        )}

        <div
          className="h-[162px] bg-white dark:bg-[#343541]"
          // ref={messagesEndRef}
        />
      </div>

      <ChatInput
        stopConversationRef={stopConversationRef}
        textareaRef={textareaRef}
        onSend={(message) => {
          // setMessages([
          //   {
          //     role: 'user',
          //     content: 'test add',
          //     id: 'incoming_message',
          //     conversation_id: messages[0].conversation_id,
          //     created_at: messages[0].created_at,
          //     updated_at: messages[0].updated_at,
          //   },
          //   ...messages,
          // ]);
          // TODO FIX
          // scrollToBottom();
          // edit related
          // setCurrentMessage(message);
          handleSend(message);
        }}
        onScrollDownClick={handleScrollDown}
        onRegenerate={() => {
          // if (currentMessage) {
          //   handleSend(currentMessage);
          // }
        }}
        showScrollDownButton={showScrollDownButton}
        hasMessages={messages.length > 0}
        model={
          models.find(
            (m) => m.id == selectedConveration?.model_id || OpenAIModelID.GPT_4,
          ) as OpenAIModel
        }
      />
    </div>;
  },
);

export default ActiveConversation;

// TODO Show settings part

//                 {/* <Conv /> */}
// {
/* {showSettings && (
                  <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                    <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
                      <ModelSelect />
                    </div>
                  </div>
                )} */
// }
