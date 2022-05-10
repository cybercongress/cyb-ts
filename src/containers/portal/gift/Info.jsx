import React from 'react';
import { InfoCard } from '../components';
import { STEP_INFO } from './utils';

const {
  GIFT_INFO,
  PROVE_ADD,
  PROVE_ADD_SIGN_MM,
  PROVE_ADD_SIGN_KEPLR,
  PROVE_GIFT_TRUE,
  PROVE_GIFT_FALSE,
  CLAIME_ALL,
  CLAIMED_ALL_GIFT,
  RELEASE,
} = STEP_INFO;

const infoTextFnc = (step, nickname) => {
  switch (step) {
    case GIFT_INFO:
      return (
        <span>
          Check gift & basic information. <br />
          Hurry up! <br /> Prove address to claim the gift
        </span>
      );

    case PROVE_ADD:
      return (
        <span>
          Prove ethereum, cosmos, osmosis, <br /> terra or bostrom signatures by{' '}
          <br />
          selecting signer to check the gift
        </span>
      );

    case PROVE_ADD_SIGN_MM:
      return <span>Sign message in metamask</span>;

    case PROVE_ADD_SIGN_KEPLR:
      return <span>sign message in keplr</span>;

    case PROVE_GIFT_TRUE:
      return (
        <span>
          {/* Address 0xsd2f1...d64 has no gift Prove another to try your luck */}
        </span>
      );

    case PROVE_GIFT_FALSE:
      return (
        <span>
          You have nothing to claim. Prove another address with the gift.
        </span>
      );

//       You have unclaimed gifts. <br />
// Claim now, <br />
// or prove another address

// Chose bostrom address <br />
// to claim all gifts, <br />
// or claim one by one 

// You claimed all gifts. <br />
// Go to release <br />
// or prove another address.

    default:
      return null;
  }
};

function Info({ stepCurrent, nickname }) {
  if (infoTextFnc(stepCurrent, nickname) !== null) {
    return (
      <InfoCard>
        <div style={{ textAlign: 'center' }}>
          {infoTextFnc(stepCurrent, nickname)}
        </div>
      </InfoCard>
    );
  }

  return null;
}

export default Info;
