import cx from 'classnames';
import { $TsFixMe } from 'src/types/tsfix';
import { Dots } from '../ui/Dots';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const audioBtn = require('../../sounds/main-button.mp3');
// const audioBtnHover = require('../../sounds/main-button-hover.mp3');

function GradientContainer({ children }: { children: React.ReactNode }) {
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
  text?: string | JSX.Element;
  img?: $TsFixMe;
  pending?: boolean;
  className?: $TsFixMe;
  pendingText?: string;
  children?: React.ReactNode;
  link?: string;
  onClick?: () => void;
};

function Button({
  disabled,
  text,
  img,
  children,
  pendingText,
  pending,
  onClick,
  link,
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
    onClick?.();

    playAudioClick();
  }

  let Component: HTMLButtonElement | Link = 'button';
  let componentProps: object = {
    type: 'button',
  };

  // if http: will need to add <a> tag
  if (link && !link.includes('http:')) {
    Component = Link;
    componentProps = {
      to: link,
    };
  }

  return (
    <Component
      type="button"
      id="BtnGrd"
      onClick={handleClick}
      className={cx(styles.containerBtnGrd, className)}
      disabled={disabled || pending}
      {...props}
      {...componentProps}
    >
      <GradientContainer>
        {pending ? (
          <>
            {pendingText || 'pending'}
            <Dots />
          </>
        ) : (
          <>
            {text || children}
            {img && (
              <img style={{ width: 20, height: 20 }} alt="img" src={img} />
            )}
          </>
        )}
      </GradientContainer>
    </Component>
  );
}

export default Button;
