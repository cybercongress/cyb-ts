import React, { useEffect, useState } from 'react';
import { useTraseDenom, isNative } from '../../hooks/useTraseDenom';
import Tooltip from '../tooltip/tooltip';
import { trimString } from '../../utils/utils';

function CoinDenom({ coinDenom, tooltipStatus }) {
  const { infoDenom } = useTraseDenom(coinDenom);
  const [textDenom, setTextDenom] = useState(null);
  const [tooltipText, setTooltipText] = useState(coinDenom);

  useEffect(() => {
    if (coinDenom.includes('pool')) {
      setTextDenom(trimString(coinDenom, 3, 3));
      setTooltipText(trimString(coinDenom, 9, 9));
    } else if (Object.prototype.hasOwnProperty.call(infoDenom, 'denom')) {
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
  }, [infoDenom, coinDenom]);

  const validTootipStatusByDenom =
    !isNative(coinDenom) || coinDenom.includes('pool');

  if (tooltipStatus && validTootipStatusByDenom) {
    return (
      <div>
        <Tooltip placement="top" tooltip={<div>{tooltipText}</div>}>
          <span>{textDenom !== null ? textDenom : '...'}</span>
        </Tooltip>
      </div>
    );
  }

  return <span>{textDenom !== null ? textDenom : '...'}</span>;
}

export default CoinDenom;
