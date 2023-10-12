// import React, {
//   MutableRefObject,
//   memo,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { toast } from 'react-hot-toast';
// import { Virtuoso } from 'react-virtuoso';

// import { OpenAIModel, OpenAIModelID } from '@/types/openai';

// import Spinner from '../Spinner/Spinner';
// import { ChatInput } from './ChatInput';
// import { ChatLoader } from './ChatLoader';
// import { SimpleList } from './MessageVirtuoso';
// import ConversationSettings from './ConversationSettings';
// import { ErrorMessageDiv } from './ErrorMessageDiv';
// // import { MemoizedChatMessage } from './MemoizedChatMessage';

// import { getConversationMessages } from '@/lib/api';
// import {
//   ParsedEvent,
//   ReconnectInterval,
//   createParser,
// } from 'eventsource-parser';
// import { ChatContext } from '@/app/chat/chat.provider';

// interface ActiveConversationProps {}

// const ActiveConversation: React.FC<ActiveConversationProps> = memo(
//   ({}: ActiveConversationProps) => {
//     const modelError = null;
//     //   TODO Load from API, add pagination
//     // const messages: {
//     //   role: Role;
//     //   content: string;
//     // }[] = [];
//     const models: Partial<OpenAIModel>[] = [
//       { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo' },
//       {
//         id: 'gpt-4',
//         name: 'gpt-4',
//       },
//     ];

//     const {
//       state: { messageIsStreaming, selectedConversationId, conversations, messages },
//       // handleDeleteConversation,
//       // handleSelectConversation,
//       // handleEditConversation,
//     } = useContext(ChatContext);

//     // const selectedConversationId = '9d866b4f-03f3-4d9c-b423-4c0a4f8f11b8';
//     // const selectedConversationId = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0';
//     // const selectedConversationId = 'ba08401a-4e6c-4b8c-a470-f4cacda7f79f';
//     // const selectedConversationId = '9d866b4f-03f3-4d9c-b423-4c0a4f8f11b8';
//     // const selectedConversationId = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0';
//     // const {
//     //   state: {
//     //     // selectedConversationId,
//     //     conversations,
//     //     //   models,
//     //   },
//     //   // handleUpdateConversation,
//     //   dispatch: homeDispatch,
//     // } = useContext(ChatContext);

//     const selectedConveration = useMemo(() => {
//       return conversations?.find((c) => c.id === selectedConversationId);
//     }, [conversations, selectedConversationId]);

//     // const [messages, setMessages] = useState(() => {
//     //   return [...(selectedConveration?.messages || [])].reverse();
//     // });

//     const reversedMessages = useMemo(() => {
//       return [...messages].reverse();
//     }, [messages]);

//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const topRef = useRef<HTMLDivElement>(null);

//     const chatContainerRef = useRef<HTMLDivElement>(null);
//     // const messagesEndRef = useRef<HTMLDivElement>(null);
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const stopConversationRef = useRef<boolean>(false);

//     const showScrollDownButton = false;

//     const [loadingNewChatMessage, setLoadingNewChatMessage] = useState(false);
//     const [loadingMoreHistoric, setLoadingMoreHistoric] = useState(false);
//     // edit related
//     // const [currentMessage, setCurrentMessage] = useState<Message>();
//     const innerDivRef = useRef<HTMLDivElement>(null);
//     const prevInnerDivHeight = useRef<number | undefined>(undefined);

//     // const [showMessages, setShowMessages] = useState(false);
//     const [showMessages, setShowMessages] = useState(true);

//     const [footer, setFooter] = useState<{
//       userRequest: string;
//       assistantMessage: string;
//     } | null>(null);

//     const scrollToBottom = useCallback(() => {
//       if (messages.length == 0) {
//         return;
//       }
//       const outerDiv = chatContainerRef.current;
//       const innerDiv = innerDivRef.current;

//       if (outerDiv && innerDiv) {
//         const isAtBottom =
//           outerDiv.scrollHeight - outerDiv.scrollTop === outerDiv.clientHeight;

//         console.log({ isAtBottom });

//         if (!prevInnerDivHeight.current || isAtBottom) {
//           // Magic number to make sure margins are accounted for correctly
//           const overscroll = 200;
//           const scrollPosition =
//             innerDiv.scrollHeight + overscroll - outerDiv.clientHeight;
//           outerDiv.scrollTo({
//             top: scrollPosition,
//             left: 0,
//             behavior: prevInnerDivHeight.current ? 'smooth' : 'auto',
//           });
//           setShowMessages(true);
//         }

//         prevInnerDivHeight.current = innerDiv.scrollHeight;
//       }
//     }, [messages]);

//     const [totalCount, setTotalCount] = useState(
//       selectedConveration?.message_count,
//     );

//     // useEffect(() => {
//     // scrollToBottom();
//     // }, [messages]);

//     // useEffect(() => {
//     //   console.log('USE EFFECT', messages);
//     //   if (initialLoad && messagesEndRef) {
//     //     setInitialLoad(false);
//     //     setTimeout(() => {
//     //       // messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
//     //     });
//     //   }
//     // }, [messages, messagesEndRef]);
//     const isCancelled = useRef(false);

//     const loadMoreMessages = useCallback(async () => {
//       setLoadingMoreHistoric(true);
//       try {
//         console.log('load more', page);
//         const resp = await getConversationMessages({
//           conversation_id: selectedConversationId,
//           page,
//           limit: 50,
//         });
//         // setHasMore(false);

//         if (!isCancelled.current) {
//           setTotalCount(resp.pagination.total_records);
//           if (resp.pagination.current_page < resp.pagination.total_pages) {
//             setPage((prev) => prev + 1);
//           } else {
//             setHasMore(false);
//           }
//           console.log({ first: resp.data[0].content });
//           return resp.data;
//         }
//         // TODO error handling
//         console.log('missed case');
//       } finally {
//         console.log('in finally');
//         setLoadingMoreHistoric(false);
//       }
//     }, [page, selectedConversationId]);

//     const handleScroll = () => {
//       // TODO
//     };

//     const handleScrollDown = () => {
//       // TODO
//     };

//     const handleSend = async (message: string) => {
//       console.log('SENDING', message);
//       // setMessages((list) => [...list, ...fixedMessages]);
//       setFooter({ userRequest: message, assistantMessage: '`▍`' });

//       // TODO FIX!!

//       // setMessages(list => [...list, fixedMessages])
//       await new Promise((resolve) => setTimeout(resolve, 0));
//       scrollToBottom();
//       // setMessages([{role: 'assistant', content: 'TESTTEST', id: 'placeholder-response'}, message, ...messages])
//       // selectedConversationId

//       const controller = new AbortController();
//       const response = await fetch('/api/chat/v2', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message_content: message,
//           // message_content: 'please reply with the text ACK.',
//           conversation_id: selectedConversationId,
//         }),
//         signal: controller.signal,
//       });
//       console.log({ response });
//       if (!response.ok) {
//         toast.error(response.statusText);
//         return;
//       }
//       const data = response.body;
//       if (!data) {
//         toast.error('missing data on response');
//         return;
//       }
//       setLoadingNewChatMessage(true);
//       console.log('HERE x');
//       // const parser = createParser(onParse);
//       const reader = data.getReader();
//       const decoder = new TextDecoder();
//       let done = false;
//       let isFirst = true;
//       let text = '';
//       // const reader = data.getReader();
//       // const decoder = new TextDecoder();

//       const onParse = (event: ParsedEvent | ReconnectInterval) => {
//         console.log({ event });
//         if (event.type === 'event') {
//           console.log(event.data);
//           text += event.data;
//           // console.l
//           try {
//             setFooter({
//               userRequest: message,
//               assistantMessage: text + '`▍`',
//             });
//           } catch (e) {
//             console.error(e);
//           }

//           // scrollToBottom()
//           // setMessages((list) => {
//           //   const reversed = list;
//           //   const top = reversed[0];
//           //   const messageFromChunk = {
//           //     ...top,
//           //     content: text + (done ? '' : '`▍`'),
//           //   };
//           //   // return [...reversed.slice(1), messageFromChunk];
//           //   // ?.content = text + (done ? '' : '`▍`')
//           //   const placeholder = list.find(i => i.id == 'placeholder-response');
//           //   if (placeholder) {
//           //     placeholder.content = text + (done ? '' : '`▍`')
//           //   }
//           //   return [...list]
//           // });
//         }
//       };

//       const parser = createParser(onParse);

//       while (!done) {
//         if (stopConversationRef.current === true) {
//           controller.abort();
//           done = true;
//           break;
//         }
//         const { done: isDone, value } = await reader.read();
//         const decoded = decoder.decode(value);
//         parser.feed(decoded);
//         done = isDone;
//       }
      
//       const reloadedTopMessages = await getConversationMessages({
//         conversation_id: selectedConversationId,
//         page: 0,
//         limit: 2,
//       });
//       setFooter(null);
//       setMessages(list => [...reloadedTopMessages.data, ...list].reverse());
//       setLoadingNewChatMessage(false);
//     };

//     useEffect(() => {
//       scrollToBottom();
//     }, [footer]);

//     const handleEditMessage = () => {
//       // onEdit={(editedMessage) => {
//       //   setCurrentMessage(editedMessage);
//       //   // discard edited message and the ones that come after then resend
//       //   handleSend(
//       //     editedMessage,
//       //     selectedConversation?.messages.length - index,
//       //   );
//       // }}
//     };

//     const updateConversationSettings = useCallback(
//       (field: string) => (value: string | number) => {
//         console.log('TODO implement updateConversationSettings');
//       },
//       [],
//     );

//     const handleUpdateConversation = () => {};

//     const START_INDEX = 1;
//     const INITIAL_ITEM_COUNT = 10;

//     // console.log('on render, ml', messages.length);
//     // console.log('on render, first', messages[0]);
//     // return (

//     // );
//     return modelError ? (
//       <ErrorMessageDiv error={modelError} />
//     ) : (
//       <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
//         {/* <MockedList /> */}
//         <SimpleList />
//         {/* <MessageList
//           totalCount={totalCount as number}
//           hasMore={hasMore}
//           messages={messages}
//           // @ts-ignore TODO
//           setMessages={setMessages}
//           onLoadMore={loadMoreMessages}
//           inProgressFooter={footer}
//         /> */}

//         <ChatInput
//           stopConversationRef={stopConversationRef}
//           textareaRef={textareaRef}
//           onSend={handleSend}
//           // onSend={(message) => {
//           // setMessages([
//           //   {
//           //     role: 'user',
//           //     content: 'test add',
//           //     id: 'incoming_message',
//           //     conversation_id: messages[0].conversation_id,
//           //     created_at: messages[0].created_at,
//           //     updated_at: messages[0].updated_at,
//           //   },
//           //   ...messages,
//           // ]);
//           // TODO FIX
//           // scrollToBottom();
//           // edit related
//           // setCurrentMessage(message);
//           // (message);
//           // }}
//           onScrollDownClick={handleScrollDown}
//           onRegenerate={() => {
//             // if (currentMessage) {
//             //   handleSend(currentMessage);
//             // }
//           }}
//           showScrollDownButton={showScrollDownButton}
//           hasMessages={messages.length > 0}
//           model={
//             models.find(
//               (m) =>
//                 m.id == selectedConveration?.model_id || OpenAIModelID.GPT_4,
//             ) as OpenAIModel
//           }
//         />
//       </div>
//     );
//   },
// );

// ActiveConversation.displayName = 'ActiveConversation';
// export default ActiveConversation;

// {
//   /* <div
//           className="h-full overflow-auto"
//           // style={{marginBottom: "300px"}}
//           // className="max-h-full overflow-auto flex flex-col-reverse"
//           // className="h-50 overflow-auto flex flex-col-reverse"
//           ref={chatContainerRef}
//           onScroll={handleScroll}
//         >
          

//           <div
//             className="h-[162px] bg-white dark:bg-[#343541]"
//             // ref={messagesEndRef}
//           />
//         </div> */
// }

// // TODO Show settings part

// //                 {/* <Conv /> */}
// // {
// /* {showSettings && (
//                   <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
//                     <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
//                       <ModelSelect />
//                     </div>
//                   </div>
//                 )} */
// // }

// // Snippet for settings
// // {messages.length === 0 ? (
// //   <ConversationSettings
// //     currentPrompt={selectedConveration?.prompt}
// //     models={models}
// //     model_id={selectedConveration?.model_id}
// //     onChangeSystemPrompt={updateConversationSettings('prompt')}
// //     onModelSelect={updateConversationSettings('model_id')}
// //     onChangeTemperature={updateConversationSettings('temperature')}
// //   />
// // ) : (
// //   <>
// //     <div
// //       className="relative h-full transition-all duration-300 overflow-hidden"
// //       style={{ opacity: showMessages ? 1 : 0 }}
// //       ref={innerDivRef}
// //     >
// //       <div
// //         ref={topRef}
// //         className={`h-10 flex items-center justify-center ${
// //           loadingMoreHistoric ? 'opacity-100' : 'opacity-0'
// //         }`}
// //       >
// //         <Spinner />
// //       </div>

// //       {/* {loadingNewChatMessage ||
// //       (loadingNewChatMessage && <ChatLoader />)} */}
// //     </div>
// //   </>
// // )}
