import { useCallback } from 'react';

interface Props {
  onClose: () => void;
}

export const BillingDialog = (props: Props) => {
  const handleInsideClick = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`block fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
      onClick={props.onClose}
    >
      <div
        className="bg-gray-800 text-white w-200 p-6 rounded shadow"
        onClick={handleInsideClick}
      >
        Top-up Balance
        {/* <ConversationSettings /> */}
        <div className="mt-8">
          <button
            onClick={props.onClose}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close settings
          </button>
        </div>
      </div>
    </div>
  );
};
