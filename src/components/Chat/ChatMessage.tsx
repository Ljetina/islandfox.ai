'use client';

import { IconCheck, IconCopy, IconRobot, IconUser } from '@tabler/icons-react';
import { FC, memo, useContext, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Message } from '@/types/chat';

import { CodeBlock } from '../Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';

import { ChatContext } from '@/app/chat/chat.provider';
// import ChatContext from '@/app/chat/chat.context';
// import { updateConversation } from '@/lib/conversation';
// import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface Props {
  message: Message;
  messageIndex: number;
  onEdit?: (editedMessage: Message) => void;
}

export const ChatMessage: FC<Props> = memo(
  ({ message, messageIndex, onEdit }) => {
    const {
      state: {
        selectedConversationId,
        conversations,
        messageIsStreaming,
        messages,
        
      },
    } = useContext(ChatContext);
    const selectedConversation = useMemo(
      () => conversations?.find((c) => c.id === selectedConversationId),
      [selectedConversationId, conversations],
    );

    // const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // const [messageContent, setMessageContent] = useState(message.content);
    const [messagedCopied, setMessageCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // EDIT RELATED
    // useEffect(() => {
    //   if (textareaRef.current) {
    //     textareaRef.current.style.height = 'inherit';
    //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    //   }
    // }, [isEditing]);

    const toggleEditing = () => {
      // TODO
      // setIsEditing(!isEditing);
    };

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      // TODO
      // setMessageContent(event.target.value);
      // if (textareaRef.current) {
      //   textareaRef.current.style.height = 'inherit';
      //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      // }
    };

    const handleEditMessage = () => {
      // TODO
      // if (message.content != messageContent) {
      //   if (selectedConversation && onEdit) {
      //     onEdit({ ...message, content: messageContent });
      //   }
      // }
      // setIsEditing(false);
    };

    const handleDeleteMessage = () => {
      // TODO
      // if (!selectedConversation) return;
      // const { messages } = selectedConversation;
      // const findIndex = messages.findIndex((elm) => elm === message);
      // if (findIndex < 0) return;
      // if (
      //   findIndex < messages.length - 1 &&
      //   messages[findIndex + 1].role === 'assistant'
      // ) {
      //   messages.splice(findIndex, 2);
      // } else {
      //   messages.splice(findIndex, 1);
      // }
      // const updatedConversation = {
      //   ...selectedConversation,
      //   messages,
      // };
      // const { single, all } = updateConversation(
      //   updatedConversation,
      //   conversations,
      // );
      // homeDispatch({ field: 'selectedConversation', value: single });
      // homeDispatch({ field: 'conversations', value: all });
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // TODO
      // if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
      //   e.preventDefault();
      //   handleEditMessage();
      // }
    };

    // useEffect(() => {
    //   setMessageContent(message.content);
    // }, [message.content]);

    // if (!messageContent) {
    //   return null;
    // }

    // END EDIT RELATED

    const copyOnClick = () => {
      if (!navigator.clipboard || !message.content) return;
      navigator.clipboard.writeText(message.content).then(() => {
        setMessageCopied(true);
        setTimeout(() => {
          setMessageCopied(false);
        }, 2000);
      });
    };

    return (
      <div
        className={`group md:px-4 ${
          ['assistant', 'function'].includes(message.role)
            ? 'border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#2e2343] dark:text-gray-100'
            : 'border-b border-black/10 bg-white text-gray-800 dark:border-gray-900/50 dark:bg-[#1d183f] dark:text-gray-100'
        }`}
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
          <div className="min-w-[40px] text-right font-bold">
            {['assistant', 'function'].includes(message.role) ? (
              <IconRobot size={30} />
            ) : (
              <IconUser size={30} />
            )}
          </div>

          <div className="prose mt-[-2px] w-full dark:prose-invert">
            {message.role === 'user' ? (
              <div className="flex w-full">
                {/* {isEditing ? (
                  <div className="flex w-full flex-col">
                    <textarea
                      ref={textareaRef}
                      className="w-full resize-none whitespace-pre-wrap border-none dark:bg-[#343541]"
                      value={messageContent}
                      onChange={handleInputChange}
                      onKeyDown={handlePressEnter}
                      onCompositionStart={() => setIsTyping(true)}
                      onCompositionEnd={() => setIsTyping(false)}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        padding: '0',
                        margin: '0',
                        overflow: 'hidden',
                      }}
                    />

                    <div className="mt-10 flex justify-center space-x-4">
                      <button
                        className="h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white enabled:hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleEditMessage}
                        disabled={messageContent.trim().length <= 0}
                      >
                        {t('Save & Submit')}
                      </button>
                      <button
                        className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        onClick={() => {
                          setMessageContent(message.content);
                          setIsEditing(false);
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </div>
                ) : ( */}
                <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                  {message.content}
                </div>
                {/* <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                    {message.content}
                  </div> */}
                {/* )} */}

                {/* {!isEditing && (
                  <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={toggleEditing}
                    >
                      <IconEdit size={20} />
                    </button>
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={handleDeleteMessage}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                )} */}
              </div>
            ) : (
              <div className="flex flex-row">
                <MemoizedReactMarkdown
                  className="prose dark:prose-invert flex-1"
                  remarkPlugins={[remarkGfm, remarkMath]}
                  // rehypePlugins={[rehypeMathjax]}
                  components={{
                    // TODO clear any
                    code({ node, inline, className, children, ...props }: any) {
                      if (children.length) {
                        if (children[0] == '▍') {
                          return (
                            <span className="animate-pulse cursor-default mt-1">
                              ▍
                            </span>
                          );
                        }

                        children[0] = (children[0] as string).replace(
                          '`▍`',
                          '▍',
                        );
                      }

                      const match = /language-(\w+)/.exec(className || '');

                      return !inline ? (
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // TODO clear any
                    table({ children }: any) {
                      return (
                        <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                          {children}
                        </table>
                      );
                    },
                    // TODO clear any
                    th({ children }: any) {
                      return (
                        <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                          {children}
                        </th>
                      );
                    },
                    // TODO clear any
                    td({ children }: any) {
                      return (
                        <td className="break-words border border-black px-3 py-1 dark:border-white">
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {`${message.name ? message.name : message.content}${
                    messageIsStreaming && messageIndex == 0
                      ? '`▍`'
                      : ''
                  }`}
                </MemoizedReactMarkdown>

                <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                  {messagedCopied ? (
                    <IconCheck
                      size={20}
                      className="text-green-500 dark:text-green-400"
                    />
                  ) : (
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={copyOnClick}
                    >
                      <IconCopy size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ChatMessage.displayName = 'ChatMessage';
