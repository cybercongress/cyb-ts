import { useEffect, useState } from 'react';
import Tooltip from '../tooltip/tooltip';
import { trimString } from '../../utils/utils';
import styles from './TextDenom.module.scss';

export type CoinDenomProps = {
  coinDenom: string;
  // use demom type
  infoDenom: {
    denom: string;
    path: string;
    native?: boolean;
  } | null;
  tooltipStatus?: boolean;
};

function CoinDenom({ coinDenom, tooltipStatus, infoDenom }: CoinDenomProps) {
  const [textDenom, setTextDenom] = useState<string | null>(null);
  const [tooltipText, setTooltipText] = useState(coinDenom);

  useEffect(() => {
    if (coinDenom.includes('pool')) {
      setTextDenom(trimString(coinDenom, 3, 3));
      setTooltipText(trimString(coinDenom, 9, 9));
    } else if (
      infoDenom &&
      Object.prototype.hasOwnProperty.call(infoDenom, 'denom')
    ) {
      const { denom, path } = infoDenom;
      if (denom.length < 20) {
        setTextDenom(denom);
      } else {
        setTextDenom(trimString(denom, 12, 4));
      }
      if (path.length > 0) {
        setTooltipText(path);
      }
    } else {
      setTextDenom(coinDenom.toUpperCase());
    }
  }, [coinDenom, infoDenom]);

  const validInfo =
    infoDenom &&
    Object.prototype.hasOwnProperty.call(infoDenom, 'native') &&
    infoDenom.native === false;

  const validTootipStatusByDenom = validInfo || coinDenom.includes('pool');

  const denom = <span className={styles.denom}>{textDenom || '...'}</span>;

  if (tooltipStatus && validTootipStatusByDenom) {
    return (
      <Tooltip placement="top" tooltip={<div>{tooltipText}</div>}>
        {denom}
      </Tooltip>
    );
  }

  return denom;
}

export default CoinDenom;
