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
  STEP_ACTIVE_ADD
} = steps;

// Choose your nickname. You will own this as an NFT.

// Nickname is currently available.

// Dear ~mastercyb,
// Before setting up your account you must follow these steps.

// Upload a gif or picture. You will own this as an NFT also.

// Looks good. The next step is to get an address.

// You need Keplr to use cyb.
// It is opensource and cool!
// Check repository if necessary.

// Create an account in Keplr.
// You will then have addresses
// in the Cyber ecosystem.

// Connect Keplr.
// One click left!

// Activation takes time, patience, and a lot of lube. After that, you can register your passport.

// Register passport, then check for a gift proving Ethereum, Cosmos, Osmosis and Terra addresses.

// Registration takes time.
// Time, patience and a lot of lube.
// Check gift while waiting.

// Congratulations, ~mastercyb -
// You are a citizen of the Moon.
// Try your luck and check for a gift!

const infoTextFnc = (step, nickname) => {
  switch (step) {
    case STEP_NICKNAME:
      return (
        <span>
          Choose your nickname. You will own it as an NFT.
        </span>
      );

    case STEP_RULES:
      return (
        <span>
          Dear {nickname}, before setting up your account abide by these rules.
        </span>
      );

    case STEP_AVATAR_UPLOAD:
      return (
        <span>
          Upload a gif or picture. You will also own this as an NFT.
        </span>
      );
    case STEP_KEPLR_INIT:
      return (
        <span>
          You need Keplr to use cyb. It is opensource and cool! Check repository if necesarry. 
        </span>
      );
    case STEP_KEPLR_SETUP:
      return (
        <span>
          Create an account in Keplr. You will then have addresses in the
          Cyber ecosystem.
        </span>
      );

    case STEP_KEPLR_CONNECT:
      return (
        <span>
          Connect Keplr. One click left! 
        </span>
      );

    case STEP_ACTIVE_ADD:
    case STEP_CHECK_ADDRESS:
      return (
        <span>Your passport can be registered after address activation.</span>
      );

    case STEP_KEPLR_REGISTER:
      return (
        <span>
          Register passport, then check for a gift proving Ethereum, Cosmos, Osmosis and Terra addresses.
        </span>
      );

    case STEP_DONE:
    case STEP_CHECK_GIFT:
      return (
        <span>
          Congratulations, {nickname} - you are a citizen of the Moon! Try your luck and check for a gift.
        </span>
      );

    default:
      return null;
  }

  //   [STEP_AVATAR_UPLOAD]: (
  //     <span>
  //       Upload a gif or picture. You will own it as an NFT also.
  //     </span>
  //   ),
  //   [STEP_KEPLR_INIT]: (
  //     <span>
  //       You need Keplr to use cyb. It is opensource and cool! <br /> Check
  //       repository if necesarry.
  //     </span>
  //   ),
  //   [STEP_KEPLR_SETUP]: (
  //     <span>
  //       Create an account in Keplr. You will then have addresses in the Cyber
  //       ecosystem.
  //     </span>
  //   ),
  //   [STEP_KEPLR_CONNECT]: (
  //     <span>
  //       Connect Keplr. One click left!
  //     </span>
  //   ),
  //   [STEP_CHECK_ADDRESS]: (
  //     <span>
  //       Activation takes time, patience, and a lot of lube. After that, you
  //       can register your passport.
  //     </span>
  //   ),
  //   [STEP_KEPLR_REGISTER]: (
  //     <span>
  //       Register passport, then check for a gift proving Ethereum, Cosmos,
  //       Osmosis and Terra addresses.
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
