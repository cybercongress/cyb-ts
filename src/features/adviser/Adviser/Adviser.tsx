import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import styles from './Adviser.module.scss';
// import TypeIt from 'typeit-react';

export enum AdviserColors {
  blue = 'blue',
  green = 'green',
  red = 'red',
  purple = 'purple',
  yellow = 'yellow',
}

export type Props = {
  children: React.ReactNode | string;
  color?: AdviserColors | keyof typeof AdviserColors;
  disabled?: boolean;
  className?: string;

  isOpen?: boolean;
  openCallback?: (isOpen: boolean) => void;
};

const synth = window.speechSynthesis;

function play(text: string) {
  // replace emoji
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]/gu, '');

  const utterThis = new SpeechSynthesisUtterance(cleanText);
  utterThis.lang = 'en-US';

  // woman voice
  utterThis.voice = synth
    .getVoices()
    .find((voice) => voice.name === 'Google US English');

  synth.speak(utterThis);
}

function Adviser({
  children,
  color = AdviserColors.blue,
  className,
  disabled,
  openCallback,
  isOpen: forceOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  useEffect(() => {
    // context infinity render
    const timeout = setTimeout(() => {
      if (openCallback && isOpen !== forceOpen) {
        openCallback(isOpen);
      }
    }, 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [openCallback, isOpen, forceOpen]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = ref.current?.textContent;

    if (text && color === AdviserColors.blue && isOpen) {
      play(text);
    }

    return () => {
      synth.cancel();
    };
  }, [children, ref, color, isOpen]);

  return (
    // maybe try use <details> tag
    <button
      type="button"
      disabled={disabled}
      className={cx(styles.wrapper, styles[`color_${color}`], className, {
        [styles.open]: isOpen && children,
      })}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={styles.summary}>Adviser</span>
      <div className={styles.content} ref={ref}>
        {/* {color !== AdviserColors.purple ? (
          <TypeIt
            // for resetting the animation
            key={children + children?.length}
            as="div"
            className={styles.typer}
            options={{
              speed: 30,
              cursor: false,
              waitUntilVisible: true,
            }}
          >
            {children}
          </TypeIt>
        ) : (
          children
        )} */}
        {children}
      </div>
    </button>
  );
}

export default Adviser;
