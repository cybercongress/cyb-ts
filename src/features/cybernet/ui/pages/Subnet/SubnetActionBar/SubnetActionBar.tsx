import { useState } from 'react';

import ActionBar from 'src/components/actionBar';
import { useAdviser } from 'src/features/adviser/context';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';
import { DenomArr } from 'src/components';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/constants';
import useQueryCybernetContract from '../../../useQueryCybernetContract.refactor';

type Props = {
  netuid: number;
  burn: number | undefined;
  addressSubnetRegistrationStatus: number | undefined | null;
};

enum Steps {
  INITIAL,
  REGISTER_CONFIRM,
  // maybe be more steps
}

function SubnetActionBar({
  netuid,
  burn,
  addressSubnetRegistrationStatus,
}: Props) {
  const [step, setStep] = useState(Steps.INITIAL);

  const address = useAppSelector(selectCurrentAddress);

  const { setAdviser } = useAdviser();

  const canRegister = addressSubnetRegistrationStatus === null;

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
    onSuccess: () => {
      setAdviser('Registered', 'green');
      setStep(Steps.INITIAL);
    },
  });

  let button;
  let content;
  let onClickBack: undefined | (() => void);

  if (canRegister && netuid === 0) {
    return (
      <ActionBar
        button={{
          text: 'Register to root',
          link: '/contracts/' + CYBERNET_CONTRACT_ADDRESS,
        }}
      >
        no ui for now, use contract call
      </ActionBar>
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
