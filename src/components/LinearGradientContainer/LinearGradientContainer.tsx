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
};

function LinearGradientContainer({ active, color }: Props) {
  return (
    <div
      className={cx(styles.textbox, color && styles[color], {
        [styles.active]: active,
      })}
    >
      <div className={cx(styles.textboxFace, styles.textboxBottomGradient)} />
      <div className={cx(styles.textboxFace, styles.textboxBottomLine)} />
    </div>
  );
}

export default LinearGradientContainer;
