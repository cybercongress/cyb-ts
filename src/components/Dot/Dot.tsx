import cx from 'classnames';
import styles from './Dot.module.scss';

export enum DotColors {
  blue = 'blue',
  green = 'green',
  red = 'red',
  purple = 'purple',
  yellow = 'yellow',
}

type Props = {
  color: DotColors | keyof typeof DotColors;
  className?: string;
  animation?: boolean;
};

function Dot({ color, className, animation }: Props) {
  return (
    <span
      className={cx(styles.dot, styles[`color_${color}`], className, {
        [styles.animation]: animation,
      })}
    />
  );
}

export default Dot;
