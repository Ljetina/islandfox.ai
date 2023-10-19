import * as React from 'react';

interface Props {
  buttonId: string;
  tenantId: string;
  email: string;
}

function BuyButtonComponent({ buttonId, tenantId, email }: Props) {
  return (
    <div>
      {/* @ts-ignore */}
      <stripe-buy-button
        client-reference-id={tenantId}
        customer-email={email}
        buy-button-id={buttonId}
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE}
      />
    </div>
  );
}

export default BuyButtonComponent;
