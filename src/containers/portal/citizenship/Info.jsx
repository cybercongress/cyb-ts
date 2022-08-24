/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { steps } from './utils';
import { InfoCard } from '../components';
import { formatNumber } from '../../../utils/search/utils';
import { BOOT_ICON } from '../utils';
import { LinkWindow } from '../../../components';

const {
  STEP_INIT,
  STEP_NICKNAME_CHOSE,
  STEP_NICKNAME_APROVE,
  STEP_NICKNAME_INVALID,
  STEP_RULES,
  STEP_AVATAR_UPLOAD,
  STEP_KEPLR_INIT,
  STEP_KEPLR_INIT_INSTALLED,
  STEP_KEPLR_INIT_CHECK_FNC,
  STEP_KEPLR_SETUP,
  STEP_KEPLR_CONNECT,
  STEP_CHECK_ADDRESS,
  STEP_KEPLR_REGISTER,
  STEP_DONE,
  STEP_CHECK_GIFT,
  STEP_CHECK_ADDRESS_CHECK_FNC,
  STEP_ACTIVE_ADD,
} = steps;

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const typeInterval = () => {
  const randomMs = 100 * Math.random();
  return randomMs < 50 ? 10 : randomMs;
};

const InfoTypingText = ({ content }) => {
  // useEffect(() => {
  //   const typingFunc = async () => {
  //     const node = document.querySelector('#TypingText');
  //     node.innerHTML = '';
  //     if (content !== null) {
  //       const { children } = content.props;
  //       for (const key in children) {
  //         if (Object.hasOwnProperty.call(children, key)) {
  //           const item = children[key];
  //           if (item.type && item.type === 'br') {
  //             node.innerHTML += '<br />';
  //           } else {
  //             for (const character in item) {
  //               if (Object.hasOwnProperty.call(item, character)) {
  //                 const element = item[character];
  //                 node.innerHTML += element;
  //                 await sleep(typeInterval());
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };
  //   typingFunc();
  // }, [content]);

  useEffect(() => {
    const typingFunc = async () => {
      const node = document.querySelector('#TypingText');
      console.log('node', node);
      node.innerText = '';
      await node.type('Hello, \n dfsd');
    };
    typingFunc();
  }, [content]);

  // return customElements.define('type-async', TypeAsync, { extends: 'span' });
  // return <type-async id="TypingText" />;
  // return <span id="TypingText" />;
};

function Info({
  stepCurrent,
  nickname,
  valuePriceNickname,
  registerDisabled,
  setStep,
  counCitizenshipst,
}) {
  const useContent = useMemo(() => {
    let content;

    switch (stepCurrent) {
      case STEP_INIT:
        content = (
          <div
            style={{
              textAlign: 'center',
              padding: '10px 50px 0px 50px',
              gap: 20,
              display: 'grid',
            }}
          >
            <div>My name is Cyb.</div>
            <div>
              I have helped{' '}
              <span style={{ color: '#36d6ae' }}>
                {formatNumber(counCitizenshipst)}
              </span>{' '}
              beings recieve Moon Citizenship.
            </div>
            <div>I can also assist you in 7 simple steps.</div>
            <div>If you work hard, you may get a gift!</div>
          </div>
        );
        break;

      case STEP_NICKNAME_CHOSE:
        content = (
          <span>
            Choose your nickname. You will own it as an NFT.
            <br />
            8+ symbols are free
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
            Nickname is available{' '}
            {valuePriceNickname && valuePriceNickname !== null && (
              <>
                for
                {` ${formatNumber(
                  valuePriceNickname.amountPrice
                )} ${BOOT_ICON}`}
                <br /> 8+ symbols are freexs
              </>
            )}
          </span>
        );
        break;

      case STEP_RULES:
        content = (
          <span>
            Dear {nickname}, sign the Moon Code before setting up your account.
          </span>
        );
        break;

      case STEP_AVATAR_UPLOAD:
        content = (
          <span>
            Upload a gif or picture. You will also own this as an NFT.
          </span>
        );
        break;

      case STEP_KEPLR_INIT_CHECK_FNC:
      case STEP_KEPLR_INIT:
      case STEP_KEPLR_INIT_INSTALLED:
        content = (
          <span>
            You need Keplr to use cyb. <br />
            It is opensource and cool! <br /> Check{' '}
            <LinkWindow to="https://www.keplr.app/">repository</LinkWindow> if
            necesarry
          </span>
        );
        break;

      case STEP_KEPLR_SETUP:
        content = (
          <span>
            Create an account in keplr. <br />
            You will then have addresses in the Cyber ecosystem.
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

      case STEP_CHECK_ADDRESS_CHECK_FNC:
        content = (
          <span>
            Verification takes time. After that, you can register your passport.
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
                `${formatNumber(
                  valuePriceNickname.amountPrice
                )} ${BOOT_ICON}`}{' '}
              for register your nickname, <br /> you can{' '}
              <span
                style={{ color: '#36d6ae', cursor: 'pointer' }}
                onClick={() => setStep(STEP_NICKNAME_CHOSE)}
              >
                change
              </span>{' '}
              nickname or <Link to="/teleport">buy {BOOT_ICON}</Link>, 8+
              symbols are free
            </span>
          );
        } else {
          content = <span>Register passport, then check for a gift</span>;
        }
        break;

      case STEP_DONE:
      case STEP_CHECK_GIFT:
        content = (
          <span>
            Congratulations, {nickname} - <br /> you are a citizen of the Moon.
            Try your luck and check for a gift
          </span>
        );
        break;

      default:
        content = null;
        break;
    }

    return content;
  }, [stepCurrent, counCitizenshipst]);

  return (
    <InfoCard style={{ minHeight: '102px' }}>
      <div style={{ textAlign: 'center' }}>
        {/* <InfoTypingText content={useContent} /> */}
        {useContent !== null && useContent}
      </div>
    </InfoCard>
  );
}

export default Info;
