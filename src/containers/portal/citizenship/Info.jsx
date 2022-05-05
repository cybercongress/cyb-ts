import React from 'react';
import { steps } from './utils';
import { InfoCard } from '../components';

const {
  STEP_INIT,
  STEP_NICKNAME,
  STEP_RULES,
  STEP_AVATAR_UPLOAD,
  STEP_KEPLR_INIT,
  STEP_KEPLR_SETUP,
  STEP_KEPLR_CONNECT,
  STEP_CHECK_ADDRESS,
  STEP_KEPLR_REGISTER,
  STEP_DONE,
  STEP_CHECK_GIFT,
} = steps;

// Choose your nickname.You will own it as nft

// Nickname is available at that moment

// Dear ~mastercyb,
// before setting up your account you must endorce the rules

// Upload gif or picture.You will own it as nft also

// Looks good.You will own it as nft alsoNext step is to get address

// You need keplr to use cyb.
// it is opensource and cool.
//  Check repository if need

// Create account in keplr.
// Then you will have addresses
// in Cyber ecosystem

// Connect keplr.
// One click left

// Activation takes time, patience, and a lot of lube. After that, you can register your passport.

// Register passport, then check the gift proving ethereum, cosmos, osmosis and terra address.

// Registration take time.
// Time, patience and a lot of lube.
// Check gift while waiting.

// Congratulations, ~mastercyb -
// you are citizen of the Moon.
// Try your luck and check the gift

const infoTextFnc = (step, nickname) => {
  switch (step) {
    case STEP_NICKNAME:
      return (
        <span>
          Choose your nickname.
          <br />
          You will own it as nft
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
          it is opensource and cool. <br />
          Check repository if need
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

    case STEP_CHECK_ADDRESS:
      return (
        <span>
          Activation takes time, patience, <br /> and a lot of lube. After that,
          <br />
          you can register your passport.
        </span>
      );
    case STEP_KEPLR_REGISTER:
      return (
        <span>
          Register passport,
          <br /> then check the gift proving ethereum, <br /> cosmos, osmosis
          and terra address.
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

  //   [STEP_AVATAR_UPLOAD]: (
  //     <span>
  //       Upload gif or picture. <br /> You will own it as nft also
  //     </span>
  //   ),
  //   [STEP_KEPLR_INIT]: (
  //     <span>
  //       You need keplr to use cyb. <br /> it is opensource and cool. <br /> Check
  //       repository if need
  //     </span>
  //   ),
  //   [STEP_KEPLR_SETUP]: (
  //     <span>
  //       Create account in keplr. <br /> Then you will have addresses in Cyber
  //       ecosystem
  //     </span>
  //   ),
  //   [STEP_KEPLR_CONNECT]: (
  //     <span>
  //       Connect keplr. <br /> One click left
  //     </span>
  //   ),
  //   [STEP_CHECK_ADDRESS]: (
  //     <span>
  //       Activation takes time, patience, <br /> and a lot of lube. After that, you
  //       can register your passport.
  //     </span>
  //   ),
  //   [STEP_KEPLR_REGISTER]: (
  //     <span>
  //       Register passport, then check the <br /> gift proving ethereum, cosmos,
  //       osmosis and terra address.
  //     </span>
  //   ),
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
