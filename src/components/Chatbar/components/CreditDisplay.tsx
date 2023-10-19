import { Button, GreenButton } from "@/components/Buttons/Button";
import { useEvent } from "@/hooks/useEvents";
import { useCallback, useState } from "react";

export function CreditDisplay({
  onClickTopUp,
  creditsInUsd,
}: {
  onClickTopUp: () => void;
  creditsInUsd: string;
}) {
  const [topUpAnimation, setTopUpAnimation] = useState(false);

  const onTopUp = useCallback(() => {
    setTopUpAnimation(true);
    setTimeout(() => setTopUpAnimation(false), 5000); // duration of the animation, adjust as necessary
  }, []);

  useEvent('credit_topup', onTopUp);

  return (
    <div className="flex flex-col items-start bg-gray-800 shadow rounded-md p-4">
      <div
        className={`text-sm text-gray-100 mb-4 ${
          topUpAnimation ? 'animate-pulse' : ''
        }`}
      >
        Remaining&nbsp;credits:&nbsp;
        <span
          className={`font-semibold ${
            parseFloat(creditsInUsd) < 5 ? 'text-red-500' : 'text-white'
          }`}
        >
          ${creditsInUsd}
        </span>
      </div>
      <div className="flex justify-center w-full">
        <GreenButton onClick={onClickTopUp}>Top up</GreenButton>
      </div>
    </div>
  );
}
