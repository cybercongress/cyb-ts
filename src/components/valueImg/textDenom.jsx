import React, { useEffect, useState, useContext } from 'react';
import Tooltip from '../tooltip/tooltip';
import { isNative, trimString } from '../../utils/utils';
import { AppContext } from '../../context';

function CoinDenom({ coinDenom, tooltipStatus, infoDenom }) {
  const [textDenom, setTextDenom] = useState(null);
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
