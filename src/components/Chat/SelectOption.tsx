import { IconDialpad, IconKeyboard } from '@tabler/icons-react';
import { IconCircleKeyFilled } from '@tabler/icons-react';
import React, { useEffect } from 'react';

import { KeyButton } from './KeyButton';

interface Props {
  options?: string[];
  onOption: (option: string) => void;
  disableKeys: boolean;
}

export const SelectOptions = ({ options, onOption, disableKeys }: Props) => {
  useEffect(() => {
    let handleKeyDown: (event: KeyboardEvent) => void;
    if (options && !disableKeys) {
      const keys: string[] = [];
      for (let x = 0; x < options?.length; ++x) {
        keys.push(x + 1 + '');
      }
      handleKeyDown = (event: KeyboardEvent) => {
        if (keys.includes(event.key)) {
          event.preventDefault();
          onOption(options[parseInt(event.key) - 1]);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      if (handleKeyDown) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [options, disableKeys]);

  return options ? (
    <div className="flex flex-row flex-wrap justify-center max-w-full">
      {options.map((option, index) => (
        <div key={index} className="pt-4 pr-4">
          <button
            className={
              'bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded'
            }
            onClick={() => onOption(option)}
          >
            <div className="flex flex-row items-center justify-center">
              {!disableKeys && <KeyButton character={index + 1 + ' '} />}{' '}
              <div className="h-9 flex justify-center items-center">
                <div>{option}</div>
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  ) : null;
};
