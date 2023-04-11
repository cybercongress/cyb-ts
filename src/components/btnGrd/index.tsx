import cx from 'classnames';
import { Dots } from '../ui/Dots';
import styles from './Button.module.scss';

import { $TsFixMe } from 'src/types/tsfix';
import React from 'react';

const audioBtn = require('../../sounds/main-button.mp3');
// const audioBtnHover = require('../../sounds/main-button-hover.mp3');

function GradientContainer({
  disabled,
  children,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) {
  return <div className={styles.GradientContainer}>{children}</div>;
}

const audioBtnObg = new Audio(audioBtn);
// const audioBtnHoverObg = new Audio(audioBtnHover);

const playAudioClick = () => {
  audioBtnObg.play();
};

// const playAudioHover = () => {
//   audioBtnHoverObg.loop = true;
//   audioBtnHoverObg.play();
// };

// const stopAudioHover = () => {
//   audioBtnHoverObg.loop = false;
//   audioBtnHoverObg.pause();
//   audioBtnHoverObg.currentTime = 0;
// };

export type Props = {
  disabled?: boolean;
  children: string | JSX.Element;
  img?: $TsFixMe;
  pending?: boolean;
  className?: $TsFixMe;
  onClick: () => void;
};

function BtnGrd({
  disabled,
  children,
  img,
  pending,
  onClick,
  className,
  ...props
}: Props) {
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

  function handleClick() {
    if (onClick) {
      onClick();
    }

    playAudioClick();
  }

  return (
    <button
      type="button"
      id="BtnGrd"
      onClick={handleClick}
      className={cx(styles.containerBtnGrd, className)}
      disabled={disabled || pending}
      {...props}
    >
      <GradientContainer disabled={disabled}>
        {pending ? (
          <>
            pending
            <Dots />
          </>
        ) : (
          <>
            {children}
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
