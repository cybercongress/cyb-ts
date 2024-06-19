import { useState } from 'react';
import { AmountDenom, Button, InputNumber } from 'src/components';

import ActionBar from 'src/components/actionBar';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';
import { useGetBalance } from 'src/containers/sigma/hooks/utils';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useDelegate from '../../../hooks/useDelegate';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import { Link } from 'react-router-dom';

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

  const query = useDelegate(address);
  const stakingEnabled = !!query?.data;

  const balance = useGetBalance(queryClient, currentAddress);
  const availableBalance = balance?.liquid?.amount;

  const [amount, setAmount] = useState(0);

  const { setAdviser } = useAdviserTexts();

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
    successMessage: 'Stake has been successfully added',
  });

  const executeUnstake = useExecuteCybernetContract({
    query: {
      remove_stake: {
        hotkey: address,
        amount,
      },
    },
    onSuccess: handleSuccess,
    successMessage: 'Stake has been successfully removed',
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
      if (!stakingEnabled) {
        break;
      }

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

      setAdviser('Stake or unstake');

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

      setAdviser(
        <>
          <p>Stake</p>
          {availableBalance >= 0 && (
            <p
              style={{
                display: 'flex',
                gap: '0 7px',
              }}
            >
              Available balance:{' '}
              <AmountDenom amountValue={availableBalance} denom="pussy" />
            </p>
          )}
        </>
      );

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

      setAdviser(
        <>
          <p>Unstake</p>
          <p
            style={{
              display: 'flex',
              gap: '0 7px',
            }}
          >
            Available balance:{' '}
            <AmountDenom amountValue={stakedAmount} denom="pussy" />
          </p>
        </>
      );

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
