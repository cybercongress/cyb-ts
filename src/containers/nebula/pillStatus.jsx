import React from 'react';
import styles from './styles.scss';
import { Tooltip } from '../../components';

const cx = require('classnames');

function PillStatus({ type }) {
  return (
    <div>
      <Tooltip
        placement="bottom"
        tooltip={
          <div className={styles.containerTooltipCard}>
            type:{' '}
            <span
              style={{ backgroundColor: 'transparent' }}
              className={cx(styles.defaultPillStatusColor, {
                [styles.PillStatusNative]: type === 'native',
                [styles.PillStatusIbc]: type === 'ibc',
                [styles.PillStatusPool]: type === 'pool',
              })}
            >
              {type}
            </span>
          </div>
        }
      >
        <div
          className={cx(styles.defaultPillStatus, {
            [styles.PillStatusNative]: type === 'native',
            [styles.PillStatusIbc]: type === 'ibc',
            [styles.PillStatusPool]: type === 'pool',
          })}
        />
      </Tooltip>
    </div>
  );
}

export default PillStatus;
