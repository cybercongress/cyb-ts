import React from 'react';
import { Dots } from '../../../../components';
import styles from './styles.scss';

const audioBtn = require('../../../../sounds/main-button.mp3');
const audioBtnHover = require('../../../../sounds/main-button-hover.mp3');

function GradientContainer({ disabled, children }) {
  return <div className={styles.GradientContainer}>{children}</div>;
}

const audioBtnObg = new Audio(audioBtn);
const audioBtnHoverObg = new Audio(audioBtnHover);

const playAudioClick = () => {
  audioBtnObg.play();
};

const playAudioHover = () => {
  audioBtnHoverObg.loop = true;
  audioBtnHoverObg.play();
};

const stopAudioHover = () => {
  audioBtnHoverObg.loop = false;
  audioBtnHoverObg.pause();
  audioBtnHoverObg.currentTime = 0;
};

function BtnGrd({ disabled, text, img, pending, onClick, ...props }) {
  // useEffect(() => {
  //   const element = document.querySelector('#BtnGrd');

  //   element.addEventListener('click', playAudioClick, false);

  //   return () => {
  //     element.removeEventListener('click', playAudioClick);
  //   };
  // }, []);

  // useEffect(() => {
  //   const element = document.querySelector('#BtnGrd');

  //   element.addEventListener('mouseover', playAudioHover, false);
  //   element.addEventListener('mouseout', stopAudioHover, false);

  //   return () => {
  //     element.removeEventListener('mouseover', playAudioHover);
  //     element.removeEventListener('mouseout', stopAudioHover);
  //     stopAudioHover();
  //   };
  // }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    playAudioClick();
  };

  return (
    <button
      type="button"
      id="BtnGrd"
      onClick={handleClick}
      className={styles.containerBtnGrd}
      disabled={disabled}
      {...props}
    >
      <GradientContainer disabled={disabled}>
        {pending ? (
          <>
            pending <Dots />
          </>
        ) : (
          <>
            {text && text}
            {img && <img alt="img" />}
          </>
        )}
      </GradientContainer>
    </button>
  );
}

export default BtnGrd;
