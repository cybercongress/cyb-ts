import styles from './Triangle.module.scss';
import cx from 'classnames';

type Props = {
  direction?: 'up' | 'down';
  disabled?: boolean;
};

function Triangle({ direction = 'down', disabled }: Props) {
  return (
    <span
      className={cx(styles.triangle, {
        [styles[`triangle_${direction}`]]: true,
        [styles.disabled]: disabled,
      })}
    />
  );
}

export default Triangle;
