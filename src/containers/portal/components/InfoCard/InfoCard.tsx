import { ReactNode } from 'react';
import styles from './InfoCard.module.scss';

const cx = require('classnames');

export enum Statuses {
  primary = 'primary',
  red = 'red',
}

export type Props = {
  children: ReactNode;
  status?: Statuses;
  className?: string;
};

function InfoCard({ children, status, className, ...props }: Props) {
  return (
    <div
      className={cx(styles.containerLampAfter, {
        [styles.containerLampAfterDefault]:
          !status || status === Statuses.primary,
        [styles.containerLampAfterRed]: status === Statuses.red,
      })}
    >
      <div
        className={cx(styles.containerGradienAfter, {
          [styles.containerGradienAfterDefault]:
            !status || status === Statuses.primary,
          [styles.containerGradienAfterRed]: status === Statuses.red,
        })}
      >
        <div className={cx(styles.containerInfoCard, className)} {...props}>
          {children}
        </div>

        {/* <div className={styles.triangle} /> */}
      </div>
    </div>
  );
}

export default InfoCard;
