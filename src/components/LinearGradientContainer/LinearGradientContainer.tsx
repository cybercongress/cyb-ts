import cx from 'classnames';
import styles from './LinearGradientContainer.module.scss';

export const enum Color {
  Pink = 'pink',
  Yellow = 'yellow',
  Red = 'red',
  Black = 'black',
}

export type Props = {
  active: boolean;
  color?: Color;
  title?: string;
};

function LinearGradientContainer({ active, color, title }: Props) {
  return (
    <div className={styles.wrapper}>
      <div
        className={cx(styles.textbox, color && styles[color], {
          [styles.active]: active,
        })}
      >
        <div className={cx(styles.textboxFace, styles.textboxBottomGradient)} />
        <div className={cx(styles.textboxFace, styles.textboxBottomLine)} />
      </div>
      {title && !active && <p>{title}</p>}
    </div>
  );
}

export default LinearGradientContainer;
