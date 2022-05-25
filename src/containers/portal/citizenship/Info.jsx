import React from 'react';
import { steps } from './utils';
import { InfoCard } from '../components';

const {
  STEP_INIT,
  STEP_NICKNAME_CHOSE,
  STEP_NICKNAME_APROVE,
  STEP_NICKNAME_INVALID,
  STEP_RULES,
  STEP_AVATAR_UPLOAD,
  STEP_KEPLR_INIT,
  STEP_KEPLR_SETUP,
  STEP_KEPLR_CONNECT,
  STEP_CHECK_ADDRESS,
  STEP_KEPLR_REGISTER,
  STEP_DONE,
  STEP_CHECK_GIFT,
  STEP_ACTIVE_ADD,
} = steps;

const infoTextFnc = (step, nickname) => {
  switch (step) {
    case STEP_NICKNAME_CHOSE:
      return (
        <span>
          Choose your nickname.
          <br />
          You will own it as nft
        </span>
      );

    case STEP_NICKNAME_INVALID:
      return (
        <span>
          Nickname is unavailable. <br />
          Choose another nickname
        </span>
      );

    case STEP_NICKNAME_APROVE:
      return (
        <span>
          Nickname is available <br /> at that moment
        </span>
      );

    case STEP_RULES:
      return (
        <span>
          Dear {nickname}, <br /> before setting up your account you must
          endorce the rules
        </span>
      );

    case STEP_AVATAR_UPLOAD:
      return (
        <span>
          Upload gif or picture. <br /> You will own it as nft also
        </span>
      );
    case STEP_KEPLR_INIT:
      return (
        <span>
          You need keplr to use cyb. <br />
          it is opensource and cool. Check repository if need
        </span>
      );
    case STEP_KEPLR_SETUP:
      return (
        <span>
          Create account in keplr. <br /> Then you will have addresses <br /> in
          Cyber ecosystem
        </span>
      );

    case STEP_KEPLR_CONNECT:
      return (
        <span>
          Connect keplr. <br /> One click left
        </span>
      );

    case STEP_ACTIVE_ADD:
    case STEP_CHECK_ADDRESS:
      return (
        <span>
          Your passport can be registered <br /> after address activation.
        </span>
      );

    case STEP_KEPLR_REGISTER:
      return (
        <span>
          Register passport, then check the gift <br /> proving ethereum,
          cosmos, osmosis and terra address.
        </span>
      );

    case STEP_DONE:
    case STEP_CHECK_GIFT:
      return (
        <span>
          Congratulations, {nickname} - <br /> you are citizen of the Moon. Try
          your luck and check the gift
        </span>
      );

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
