/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { steps } from './utils';
import { InfoCard } from '../components';
import { formatNumber } from '../../../utils/search/utils';

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

function Info({
  stepCurrent,
  nickname,
  valuePriceNickname,
  registerDisabled,
  setStep,
}) {
  let content;

  switch (stepCurrent) {
    case STEP_NICKNAME_CHOSE:
      content = (
        <span>
          Choose your nickname.
          <br />
          You will own it as nft
        </span>
      );
      break;

    case STEP_NICKNAME_INVALID:
      content = (
        <span>
          Nickname is unavailable. <br />
          Choose another nickname
        </span>
      );
      break;

    case STEP_NICKNAME_APROVE:
      content = (
        <span>
          Nickname is available <br /> at that moment <br />
          {valuePriceNickname &&
            valuePriceNickname !== null &&
            `${valuePriceNickname.amountPrice} ${valuePriceNickname.denomPrice}`}
        </span>
      );
      break;

    case STEP_RULES:
      content = (
        <span>
          Dear {nickname}, <br /> before setting up your account you must
          endorce the rules
        </span>
      );
      break;

    case STEP_AVATAR_UPLOAD:
      content = (
        <span>
          Upload gif or picture. <br /> You will own it as nft also
        </span>
      );
      break;

    case STEP_KEPLR_INIT:
      content = (
        <span>
          You need keplr to use cyb. <br />
          it is opensource and cool. <br /> Check repository if need
        </span>
      );
      break;

    case STEP_KEPLR_SETUP:
      content = (
        <span>
          Create account in keplr. <br /> Then you will have addresses <br /> in
          Cyber ecosystem
        </span>
      );
      break;

    case STEP_KEPLR_CONNECT:
      content = (
        <span>
          Connect keplr. <br /> One click left
        </span>
      );
      break;

    case STEP_ACTIVE_ADD:
    case STEP_CHECK_ADDRESS:
      content = (
        <span>
          Your passport can be registered <br /> after address activation.
        </span>
      );
      break;

    case STEP_KEPLR_REGISTER:
      if (!registerDisabled) {
        content = (
          <span>
            you need{' '}
            {valuePriceNickname &&
              valuePriceNickname !== null &&
              `${formatNumber(valuePriceNickname.amountPrice)} ${
                valuePriceNickname.denomPrice
              }`}{' '}
            <br /> for register your nickname, <br /> you can{' '}
            <span
              style={{ color: '#36d6ae', cursor: 'pointer' }}
              onClick={() => setStep(STEP_NICKNAME_CHOSE)}
            >
              change
            </span>{' '}
            nickname or buy boot
          </span>
        );
      } else {
        content = (
          <span>
            Register passport, then check the gift <br /> proving ethereum,
            cosmos, osmosis and terra address.
          </span>
        );
      }
      break;

    case STEP_DONE:
    case STEP_CHECK_GIFT:
      content = (
        <span>
          Congratulations, {nickname} - <br /> you are citizen of the Moon. Try
          your luck and check the gift
        </span>
      );
      break;

    default:
      content = null;
      break;
  }

  return (
    <InfoCard style={{ minHeight: '102px' }}>
      <div style={{ textAlign: 'center' }}>{content !== null && content}</div>
    </InfoCard>
  );
}

export default Info;
