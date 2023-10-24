import React, { useEffect } from 'react';

import { KeyButton } from './KeyButton';

interface ErrorComponentProps {
  error: string | undefined;
  onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, onRetry }) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        onRetry();
      }
    };

    if (error) {
      window.addEventListener('keydown', handleKeydown);
    }

    // Cleanup: remove the event listener when the component unmounts or when there's no error
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [error, onRetry]);

  if (!error) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-400 rounded p-4 mt-4 mb-4 mx-auto w-4/5 md:w-3/5 lg:w-2/5">
      <p className="text-red-600 text-center">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 block mx-auto"
      >
        <div className="flex items-center space-x-2">
          <KeyButton character={'R'} />
          <div>{'retry'}</div>
        </div>
      </button>
    </div>
  );
};

export default ErrorComponent;
