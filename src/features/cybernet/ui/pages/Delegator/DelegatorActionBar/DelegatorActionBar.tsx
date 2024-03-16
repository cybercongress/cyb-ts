import { useMemo, useState } from 'react';
import { Button, InputNumber } from 'src/components';

import ActionBar from 'src/components/actionBar';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';

enum Steps {
  INITIAL,
  STAKE,
  UNSTAKE,
}

type Props = {
  // delegator address
  address: string;
  stakedAmount: number | undefined;
  onSuccess: () => void;
};

function DelegatorActionBar({ address, stakedAmount, onSuccess }: Props) {
  const [step, setStep] = useState(Steps.INITIAL);

  const [amount, setAmount] = useState(0);

  const query = useMemo(() => {
    return {
      add_stake: {
        hotkey: address,
      },
    };
  }, [address]);

  const funds = useMemo(() => {
    return [
      {
        denom: 'pussy',
        amount: String(amount),
      },
    ];
  }, [amount]);

  const onSuccessMemo = useMemo(() => {
    return () => {
      setStep(Steps.INITIAL);
      setAmount(0);

      onSuccess();
    };
  }, [onSuccess]);

  const { isReady, mutate, isLoading } = useExecuteCybernetContract({
    query,
    funds,
    onSuccess: onSuccessMemo,
  });

  let button;
  let content;

  switch (step) {
    case Steps.INITIAL:
      content = (
        <>
          <Button
            onClick={() => {
              setStep(Steps.STAKE);
            }}
          >
            Stake
          </Button>

          {stakedAmount && (
            <Button
              disabled
              onClick={() => {
                setStep(Steps.UNSTAKE);
              }}
            >
              Unstake
            </Button>
          )}
        </>
      );

      break;

    case Steps.STAKE:
      content = (
        <InputNumber
          value={amount}
          onChange={(val) => setAmount(Number(val))}
        />
      );

      button = {
        text: 'Stake',
        onClick: mutate,
        disabled: !isReady || isLoading,
      };

      break;

    case Steps.UNSTAKE:
      content = (
        <InputNumber
          value={amount}
          maxValue={stakedAmount}
          onChange={(val) => setAmount(Number(val))}
        />
      );

      button = {
        text: 'Unstake',
        onClick: mutate,
        disabled: !isReady || isLoading,
      };

    default:
      break;
  }

  return <ActionBar button={button}>{content}</ActionBar>;
}

export default DelegatorActionBar;
