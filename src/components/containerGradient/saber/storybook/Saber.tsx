import { ColorLamp, Positions } from '../../types';
import styles from './Saber.module.scss';
import cx from 'classnames';

type Props = {
  color?: ColorLamp;
  position?: Positions;
};

function Saber({ color = 'green', position = Positions.LEFT }: Props) {
  return <div className={cx(styles.saber, styles[color], styles[position])} />;
}

export default Saber;
