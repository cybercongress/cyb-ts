import { useState } from 'react';

import ActionBar from 'src/components/actionBar';
import { useAdviser } from 'src/features/adviser/context';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';

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

  const canRegister = addressSubnetRegistrationStatus === null;

  function handleSuccess() {
    setAdviser('Registered', 'green');
    setStep(Steps.INITIAL);
    refetch();
  }

  const { mutate: register } = useExecuteCybernetContract({
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

  const { mutate: registerRoot } = useExecuteCybernetContract({
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

  if (canRegister && netuid === 0) {
    return (
      <ActionBar
        button={{
          text: 'Register to root',
          // link: '/contracts/' + CYBERNET_CONTRACT_ADDRESS,
          onClick: registerRoot,
        }}
      ></ActionBar>
    );
  }

  switch (step) {
    case Steps.INITIAL:
      if (!canRegister) {
        break;
      }
      button = {
        text: 'Register to subnet',
        onClick: () => setStep(Steps.REGISTER_CONFIRM),
      };

      break;

    case Steps.REGISTER_CONFIRM:
      button = {
        text: 'Confirm registration',
        onClick: register,
      };

      onClickBack = () => setStep(Steps.INITIAL);

      content = (
        <>
          fee is {burn?.toLocaleString()} 🟣
          {/* <DenomArr onlyImg denomValue="pussy" /> */}
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