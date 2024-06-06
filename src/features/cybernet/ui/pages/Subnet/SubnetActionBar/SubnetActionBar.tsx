import { useState } from 'react';

import ActionBar from 'src/components/actionBar';
import { useAdviser } from 'src/features/adviser/context';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';
import useCybernetTexts from '../../../useCybernetTexts';
import { useCurrentContract, useCybernet } from '../../../cybernet.context';
import { ContractTypes } from 'src/features/cybernet/types';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { AmountDenom } from 'src/components';
import styles from './SubnetActionBar.module.scss';

type Props = {
  netuid: number;
  burn: number | undefined;
  addressSubnetRegistrationStatus: number | undefined | null;
  refetch: () => void;
};

enum Steps {
  INITIAL,
  REGISTER_CONFIRM,
}

function SubnetActionBar({
  netuid,
  burn,
  addressSubnetRegistrationStatus,
  refetch,
}: Props) {
  const [step, setStep] = useState(Steps.INITIAL);

  const address = useAppSelector(selectCurrentAddress);

  const { setAdviser } = useAdviser();
  const { getText } = useCybernetTexts();

  const notRegistered = addressSubnetRegistrationStatus === null;

  function handleSuccess() {
    setAdviser('Registered', 'green');
    setStep(Steps.INITIAL);
    refetch();
  }

  const subnetRegisterExecution = useExecuteCybernetContract({
    query: {
      burned_register: {
        netuid,
        hotkey: address,
      },
    },
    funds: [
      {
        denom: 'pussy',
        amount: String(burn),
      },
    ],
    onSuccess: handleSuccess,
  });

  const rootSubnetRegisterExecution = useExecuteCybernetContract({
    query: {
      root_register: {
        hotkey: address,
      },
    },
    onSuccess: handleSuccess,
  });

  let button;
  let content;
  let onClickBack: undefined | (() => void);

  const { type } = useCurrentContract();

  const isMlVerse = type === ContractTypes.ML;

  let text;

  // refactor ifs
  if (notRegistered && !isMlVerse) {
    text = `join ${getText('subnetwork')}`;
  } else if (isMlVerse) {
    text = 'use cli to register in ML verse subnets';
  }

  useAdviserTexts({
    defaultText: text,
  });

  const isRoot = netuid === 0;

  if (notRegistered && netuid === 0) {
    return (
      <ActionBar
        button={{
          text: `Register to ${getText('root')}`,
          onClick: rootSubnetRegisterExecution.mutate,
          disabled: rootSubnetRegisterExecution.isLoading,
        }}
      />
    );
  }

  switch (step) {
    case Steps.INITIAL:
      if (!notRegistered) {
        break;
      }

      if (!isRoot && isMlVerse) {
        button = {
          text: <span className={styles.installBtn}>install</span>,
          link: 'https://github.com/cybercongress/cybertensor',
        };
        break;
      }

      button = {
        text: `Register to ${getText('subnetwork')}`,
        onClick: () => setStep(Steps.REGISTER_CONFIRM),
      };

      break;

    case Steps.REGISTER_CONFIRM:
      button = {
        text: 'Confirm registration',
        onClick: subnetRegisterExecution.mutate,
        disabled: subnetRegisterExecution.isLoading,
      };

      onClickBack = () => setStep(Steps.INITIAL);

      content = (
        <>
          fee is
          <AmountDenom amountValue={burn} denom="pussy" />
        </>
      );

      break;

    default:
      break;
  }

  return (
    <ActionBar onClickBack={onClickBack} button={button}>
      {content}
    </ActionBar>
  );
}

export default SubnetActionBar;
