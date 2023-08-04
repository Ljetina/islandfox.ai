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

import { useFetch } from '@/hooks/useFetch';

import { Message, Role } from '@/types/chat';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';

import Spinner from '../Spinner/Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import ConversationSettings from './ConversationSettings';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';

import ChatContext from '@/app/chat/chat.context';
import { getConversationMessages } from '@/lib/api';

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

    const selectedConversationId = '9d866b4f-03f3-4d9c-b423-4c0a4f8f11b8';
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
      selectedConveration?.messages || [],
      //   [],
    );

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

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

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

    const loadMessages = useCallback(async () => {
      setLoadingMoreHistoric(true);
      try {
        const resp = await getConversationMessages({
          conversation_id: selectedConversationId,
          page,
          limit: 50,
        });
        if (!isCancelled.current) {
          if (resp.pagination.current_page < resp.pagination.total_pages) {
            setPage((prev) => prev + 1);
          } else {
            setHasMore(false);
          }
          setTimeout(() => {
            chatContainerRef.current?.scrollBy({ top: 20 });
          }, 2000);

          setTimeout(() => {
            setMessages((prev) => {
              const messageMap = new Map();
              [...prev, ...resp.data].forEach((message) => {
                messageMap.set(message.id, message);
              });
              return Array.from(messageMap.values());
            });
          }, 4000);
        }
      } finally {
        setLoadingMoreHistoric(false);
      }
    }, [setPage, setHasMore, setMessages, setLoadingMoreHistoric, page]);

    useEffect(() => {
      isCancelled.current = false;
      // setTimeout(() => {
      // loadMessages();
      // }, 5000);
      loadMessages();
      return () => {
        isCancelled.current = true;
      };
    }, [selectedConversationId]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!hasMore) return;
          if (entries[0].isIntersecting && !loadingMoreHistoric) {
            console.log('LOADING FROM OBSERVER');
            loadMessages();
          }
        },
        { threshold: 1 },
      );
      if (topRef.current) {
        observer.observe(topRef.current);
      }
      return () => {
        if (topRef.current) {
          observer.unobserve(topRef.current);
        }
        observer.disconnect();
      };
    }, [topRef, hasMore, loadingMoreHistoric, loadMessages]);

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
          id: 'placeholder-requests'
        },
        ...messages,
      ]
      setMessages(updatedMessages);
      // setMessages([{role: 'assistant', content: 'TESTTEST', id: 'placeholder-response'}, message, ...messages])
      // selectedConversationId

      const controller = new AbortController();
      const response = await fetch('/api/chat/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // message_content: message.content,
          message_content: 'please reply with the text ACK.',
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
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = '';
      while (!done) {
        if (stopConversationRef.current === true) {
          controller.abort();
          done = true;
          break;
        }
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log('cl', chunkValue.slice(0, 6));
        if (chunkValue.startsWith('data: ')) {
          console.log({ chunkValue });
          text += chunkValue.slice(6).trim();
          console.log({messages})
          updatedMessages[0].content = text
          setMessages([...updatedMessages])
          // setMessages(messages)
        }
      }
      const resp = await getConversationMessages({
        conversation_id: selectedConversationId,
        page: 0,
        limit: 2,
      });

      console.log({resp})
      setMessages([
        ...resp.data,
        ...messages.slice(2)
      ])
      setLoadingNewChatMessage(false);

      

      console.log({ text });

      // await fetch({method: "POST", url: "/api/chat/v2", body: {message_content: message.content, conversation_id: selectedConversationId}})
      // send a chat completion v2 message
      // start streaming the response
      // replace the client side messages for user and assistant with server side messages after this is done
      // filter out placeholder and incoming_stream
      //
      // TODO
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

    return modelError ? (
      <ErrorMessageDiv error={modelError} />
    ) : (
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

              {loadingNewChatMessage ||
                (loadingNewChatMessage && <ChatLoader />)}
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
              (m) =>
                m.id == selectedConveration?.model_id || OpenAIModelID.GPT_4,
            ) as OpenAIModel
          }
        />
      </div>
    );
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
