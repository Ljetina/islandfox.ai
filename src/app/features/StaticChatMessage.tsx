import { IconRobot, IconUser } from '@tabler/icons-react';

import { CodeBlock } from '@/components/Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '@/components/Markdown/MemoizedReactMarkdown';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

// @ts-ignore
export function StaticChatMessage({ message }) {
  return (
    <div
      className={`group md:px-4 ${
        ['assistant', 'function'].includes(message.role)
          ? 'border-b border-black/10 text-gray-800 dark:border-gray-900/50 bg-[#2e2343] bg-opacity-75 dark:text-gray-100'
          : 'border-b border-black/10 text-gray-800 dark:border-gray-900/50 bg-[#1d183f] bg-opacity-75 dark:text-gray-100'
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
              <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                {message.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-row">
              <MemoizedReactMarkdown
                className="prose dark:prose-invert flex-1"
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    if (children.length) {
                      if (children[0] === '▍') {
                        return (
                          <span className="animate-pulse cursor-default mt-1">
                            ▍
                          </span>
                        );
                      }

                      children[0] = (children[0] as string).replace('▍', '▍');
                    }

                    const match = /language-(\w+)/.exec(className || '');

                    return <code className={className} {...props}>
                        {children}
                      </code>
                  },
                  table({ children }) {
                    return (
                      <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                        {children}
                      </table>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="break-words border border-black px-3 py-1 dark:border-white">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {message.content}
              </MemoizedReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
