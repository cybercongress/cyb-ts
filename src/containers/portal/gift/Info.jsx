import React from 'react';
import { InfoCard } from '../components';
import { STEP_INFO } from './utils';
import { PATTERN_CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';

const {
  STATE_INIT,
  STATE_INIT_NULL,
  STATE_INIT_PROVE,
  STATE_INIT_CLAIM,
  STATE_INIT_RELEASE,
  STATE_PROVE,
  STATE_PROVE_CONNECT,
  STATE_PROVE_SIGN_MM,
  STATE_PROVE_SIGN_KEPLR,
  STATE_PROVE_SEND_SIGN,
  STATE_PROVE_CHANGE_ACCOUNT,
  STATE_CLAIME_TO_PROVE,
  STATE_GIFT_NULL_ALL,
  STATE_CLAIME,
  STATE_CLAIME_ALL,
  STATE_RELEASE,
  STATE_CLAIM_IN_PROCESS,
  STATE_PROVE_IN_PROCESS,
} = STEP_INFO;

const infoTextFnc = (step, selectedAddress) => {
  let address = '';
  if (selectedAddress && !selectedAddress.match(PATTERN_CYBER)) {
    address = trimString(selectedAddress, 10, 3);
  } else {
    address = '';
  }
  switch (step) {
    case STATE_INIT_NULL:
      return (
        <span>
          Check gift & basic information. <br />
          Hurry up! Get citizenship to be able to claim
        </span>
      );

    case STATE_INIT:
    case STATE_INIT_PROVE:
      return (
        <span>
          Check gift & basic information. <br />
          Hurry up! Prove address to claim the gift
        </span>
      );

    case STATE_INIT_CLAIM:
      return (
        <span>
          You have unclaimed gifts - <br />
          go to claim
        </span>
      );

    case STATE_INIT_RELEASE:
      return (
        <span>
          You claimed all gifts. <br />
          Go to release or prove another address.
        </span>
      );

    case STATE_PROVE:
      return (
        <span>
          Prove ethereum, cosmos, osmosis, <br /> terra or bostrom signatures by{' '}
          selecting signer to check the gift
        </span>
      );

    case STATE_PROVE_CONNECT:
      return <span>Select signer</span>;

    case STATE_PROVE_SIGN_MM:
      return <span>Sign message in metamask</span>;

    case STATE_PROVE_SIGN_KEPLR:
      return <span>sign message in keplr</span>;

    case STATE_PROVE_SEND_SIGN:
      return <span>send your signature</span>;

    case STATE_PROVE_CHANGE_ACCOUNT:
      return <span> you need change account in keplr</span>;

    case STATE_CLAIME_TO_PROVE:
      return (
        <span>
          Address{' '}
          {address !== '' && (
            <span style={{ color: '#38d6ae' }}>{address}</span>
          )}{' '}
          has no gift <br />
          Prove another to try your luck
        </span>
      );

    case STATE_GIFT_NULL_ALL:
      return (
        <span>
          You have nothing to claim. Prove another address with the gift.
        </span>
      );

    case STATE_CLAIME:
      return (
        <span>
          You have unclaimed gifts. <br />
          Claim now, or prove another address
        </span>
      );

    case STATE_CLAIME_ALL:
      return (
        <span>
          Chose bostrom address <br />
          to claim all gifts, or claim one by one
        </span>
      );

    case STATE_RELEASE:
      return (
        <span>
          You claimed all gifts. <br />
          Go to release or prove another address.
        </span>
      );

    case STATE_PROVE_IN_PROCESS:
      return <span>prove address take time</span>;

    case STATE_CLAIM_IN_PROCESS:
      return <span>claim take time</span>;

    default:
      return null;
  }
};

function Info({ stepCurrent, selectedAddress }) {
  try {
    return (
      <InfoCard style={{ minHeight: '90px' }}>
        <div style={{ textAlign: 'center' }}>
          {infoTextFnc(stepCurrent, selectedAddress)}
        </div>
      </InfoCard>
    );
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export default Info;
