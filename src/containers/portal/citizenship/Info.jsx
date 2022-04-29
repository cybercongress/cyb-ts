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

function Info({ stepCurrent }) {
  return (
    <InfoCard>
      <div>{stepCurrent}</div>
    </InfoCard>
  );
}

export default Info;
