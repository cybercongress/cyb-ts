import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import axios from 'axios';
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

function prepareText(text: string) {
  let t = text;

  // replace '\n' with .
  t = t.replace(/\n/g, '. ');

  // replace emoji
  t = t.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ''
  );

  return t;
}

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

let audioTag;

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
    const te = ref.current?.innerText;
    console.log(te);
    if (!te) {
      return;
    }
    const text = prepareText(te as string);
    console.log(text);

    if (text && color === AdviserColors.blue && isOpen) {
      (async () => {
        try {
          throw new Error('skip');
          const response = await axios.post(
            'http://localhost:3000/text-to-speech',
            {
              text,
            }
          );

          const { audioUrl } = response.data;

          if (audioUrl) {
            audioTag = new Audio(audioUrl);
            audioTag.play();
          } else {
            throw new Error('No audioUrl');
          }
        } catch (err) {
          console.log('Error:', err);

          play(text);
        }
      })();
    }

    return () => {
      synth.cancel();

      if (audioTag) {
        audioTag.pause();
        audioTag.currentTime = 0;
        audioTag = null;
      }
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
