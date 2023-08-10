import cx from 'classnames';

import styles from './Display.module.scss';
import DisplayTitle, {
  Props as DisplayTitleProps,
} from '../DisplayTitle/DisplayTitle';
import { ColorLamp, Colors } from '../types';

type Props = {
  children: React.ReactNode;
  status?: ColorLamp;
  color?: ColorLamp;
  titleProps?: Pick<DisplayTitleProps, 'title' | 'image' | 'children'>;
  isVertical?: boolean;
};

function Display({
  children,
  titleProps,
  isVertical,
  color = Colors.GREEN,
  status = Colors.GREEN,
}: Props) {
  const colorTemp = color || status;

  return (
    <div
      className={cx(styles.wrapper, styles[colorTemp], {
        [styles.vertical]: isVertical,
      })}
    >
      {titleProps && (
        <header className={styles.header}>
          <DisplayTitle
            inDisplay
            title={titleProps.title}
            image={titleProps.image}
          >
            {titleProps.children}
          </DisplayTitle>
        </header>
      )}
      {children}
    </div>
  );
}

export default Display;
