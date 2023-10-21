'use client';

import {
  IconAbacus,
  IconCheck,
  IconCopy,
  IconGauge,
  IconRobot,
  IconUser,
} from '@tabler/icons-react';
import {
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

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
import Image from 'next/image';

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

    const getIcon = useCallback(() => {
      if (
        message.role === 'function' ||
        (message.role === 'assistant' && message.function_name)
      ) {
        return <IconAbacus size={30} />;
      } else if (message.role === 'assistant') {
        return <IconIslandFox />;
      } else {
        return <IconUser />;
      }
    }, [message]);

    return (
      <div
        className={`group md:px-4 ${
          ['assistant', 'function'].includes(message.role)
            ? 'border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100'
            : 'border-b border-black/10 bg-white text-gray-800 dark:border-gray-900/50 dark:bg-[#343541] dark:text-gray-100'
        }`}
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
          <div className="min-w-[40px] text-right font-bold">
            {getIcon()}
          </div>

          <div className="prose mt-[-2px] w-full dark:prose-invert">
            {message.role === 'user' ? (
              <div className="flex w-full">
                <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                  {message.content}
                </div>
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
                    messageIsStreaming && messageIndex == 0 ? '`▍`' : ''
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

function IconIslandFox() {
  return  <Image src="/assets/img/icon/icon_logo.png" alt='islandfox' width="24" height="24"/>
}