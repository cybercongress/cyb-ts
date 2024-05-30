import { useMemo, useState } from 'react';
import { Button, InputNumber } from 'src/components';

import ActionBar from 'src/components/actionBar';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';
import { useGetBalance } from 'src/containers/sigma/hooks/utils';
import { useQueryClient } from 'src/contexts/queryClient';
import { queryClient } from '../../../../../../../.storybook/preview';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';

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

function DelegateActionBar({ address, stakedAmount, onSuccess }: Props) {
  const [step, setStep] = useState(Steps.INITIAL);

  const currentAddress = useAppSelector(selectCurrentAddress);

  const queryClient = useQueryClient();

  const balance = useGetBalance(queryClient, currentAddress);
  const availableBalance = balance?.liquid?.amount;

  const [amount, setAmount] = useState(0);

  function handleSuccess() {
    setStep(Steps.INITIAL);
    setAmount(0);

    onSuccess();
  }

  const executeStake = useExecuteCybernetContract({
    query: {
      add_stake: {
        hotkey: address,
      },
    },
    funds: [
      {
        denom: 'pussy',
        amount: String(amount),
      },
    ],
    onSuccess: handleSuccess,
  });

  const executeUnstake = useExecuteCybernetContract({
    query: {
      remove_stake: {
        hotkey: address,
        amount,
      },
    },
    onSuccess: handleSuccess,
  });

  let button;
  let content;
  let onClickBack;

  function handleClickBack() {
    setStep(Steps.INITIAL);
    setAmount(0);
  }

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

    case Steps.STAKE: {
      const { mutate, isReady, isLoading } = executeStake;

      content = (
        <InputNumber
          value={amount}
          disabled={isLoading}
          maxValue={availableBalance}
          onChange={(val) => setAmount(Number(val))}
        />
      );

      onClickBack = handleClickBack;

      button = {
        text: 'Stake',
        onClick: mutate,
        disabled: !isReady || amount === 0,
        pending: isLoading,
      };

      break;
    }

    case Steps.UNSTAKE: {
      const { mutate, isReady, isLoading } = executeUnstake;

      content = (
        <InputNumber
          value={amount}
          disabled={isLoading}
          maxValue={stakedAmount}
          onChange={(val) => setAmount(Number(val))}
        />
      );

      onClickBack = handleClickBack;

      button = {
        text: 'Unstake',
        onClick: mutate,
        disabled: !isReady || amount === 0,
        pending: isLoading,
      };

      break;
    }

    default:
      break;
  }

  return (
    <ActionBar onClickBack={onClickBack} button={button}>
      {content}
    </ActionBar>
  );
}

export default DelegateActionBar;
