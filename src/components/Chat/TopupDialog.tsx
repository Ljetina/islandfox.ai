import { useCallback } from 'react';

import BuyButtonComponent from './BuyButton';

interface Props {
  tenantId: string;
  email: string;
  onClose: () => void;
}

export const TopUpDialog = (props: Props) => {
  const handleInsideClick = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`block fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
      onClick={props.onClose}
    >
      <div
        className="text-white w-200 p-6 rounded shadow flex justify-between space-x-4"
        onClick={handleInsideClick}
      >
        <BuyButtonComponent
          email={props.email}
          tenantId={props.tenantId}
          buttonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_10 as string}
        />
        <BuyButtonComponent
          email={props.email}
          tenantId={props.tenantId}
          buttonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_50 as string}
        />
      </div>
    </div>
  );
};
