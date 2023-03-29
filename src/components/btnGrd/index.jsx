import React from 'react';
import { Dots } from '../ui/Dots';
import styles from './styles.scss';

const audioBtn = require('../../sounds/main-button.mp3');
const audioBtnHover = require('../../sounds/main-button-hover.mp3');

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
            {img && (
              <img style={{ width: 20, height: 20 }} alt="img" src={img} />
            )}
          </>
        )}
      </GradientContainer>
    </button>
  );
}

export default BtnGrd;
