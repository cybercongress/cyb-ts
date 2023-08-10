import cx from 'classnames';
import styles from './DisplayTitle.module.scss';
import { ColorLamp } from '../types';

export type Props = {
  title: string;

  children?: React.ReactNode;
  // temp prop
  animationState?: string;

  // to remove padding
  inDisplay?: boolean;

  color?: ColorLamp;

  image?: {
    src?: string;
    content?: React.ReactNode;
    alt?: string;
    isLarge?: boolean;
  };
};

// need split this component
function DisplayTitle({
  title,
  animationState: state = 'entered',
  image,
  children,
  inDisplay,
  color = 'white',
}: Props) {
  const content = (
    <div className={cx(styles.displayTitle, styles[color])}>
      <div
        className={cx(
          styles.displayTitleContent,
          styles[`displayTitleContent${state}`]
        )}
      >
        {image && image.src ? (
          <img
            src={image.src}
            alt={image.alt}
            className={cx(styles.titleImage, {
              [styles.big]: image.isLarge,
            })}
          />
        ) : (
          image?.content
        )}

        {title}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );

  if (inDisplay) {
    return <div className={styles.noPaddingWrapper}>{content}</div>;
  }

  return content;
}

export default DisplayTitle;
