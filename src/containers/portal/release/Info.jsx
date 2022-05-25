import React from 'react';
import { InfoCard } from '../components';
import { STEP_INFO } from './utils';

const {
  STATE_BEFORE_ACTIVATION,
  STATE_READY_TO_RELEASE,
  STATE_NEXT_UNFREEZE,
  STATE_PROVE_ADDRESS,
} = STEP_INFO;

const infoTextFnc = (step, useReleasedStage) => {
  switch (step) {
    case STATE_BEFORE_ACTIVATION:
      return (
        <span>
          Gift will start to release <br />
          after 100 000 citizen. <br />
          Invite friends to make it faster
        </span>
      );

    case STATE_READY_TO_RELEASE:
      return (
        <span>
          10% of your BOOT is liquid. <br />
          1% become liquid every new day. <br /> Start your day releasing BOOT
          gift
        </span>
      );

    case STATE_NEXT_UNFREEZE:
      return (
        <span>
          Release 1% tomorrow. <br />
          Hire hero and <br />
          get H token for free
        </span>
      );

    case STATE_PROVE_ADDRESS:
      return (
        <span>
          You have nothing to release. <br />
          Prove another address <br />
          or claime address with the gift.
        </span>
      );

    default:
      return null;
  }
};

function Info({ stepCurrent, useReleasedStage }) {
  try {
    return (
      <InfoCard>
        <div style={{ textAlign: 'center' }}>
          {infoTextFnc(stepCurrent, useReleasedStage)}
        </div>
      </InfoCard>
    );
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export default Info;
