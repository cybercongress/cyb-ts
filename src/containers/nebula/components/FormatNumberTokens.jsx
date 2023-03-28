import BigNumber from 'bignumber.js';
import React from 'react';
import { DenomArr } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import styles from '../styles.scss';

const getDecimal = (number, float) => {
  const nstring = new BigNumber(number).toString();
  const narray = nstring.split('.');
  let position = 3;
  if (number < 0.001) {
    // position = Math.floor(Math.abs(Math.log10(number))) + 2;
    position = 6;
  }
  const result = narray.length > 1 ? `.${narray[1].slice(0, position)}` : '';
  return result;
};

function FormatNumberTokens({
  text,
  value,
  tooltipStatusImg,
  styleValue,
  float,
  customText,
  ...props
}) {
  const decimal = getDecimal(value, float);
  return (
    <div
      style={{ gridTemplateColumns: text || customText ? '1fr 20px' : '1fr' }}
      className={styles.containerFormatNumberTokens}
      {...props}
    >
      <div
        style={styleValue}
        className={styles.containerFormatNumberTokensNumber}
      >
        <span>{formatNumber(Math.floor(value))}</span>
        <span className={styles.containerFormatNumberTokensNumberDecimal}>
          {decimal}
        </span>
      </div>
      {text && (
        <div className={styles.containerFormatNumberTokensDenomImg}>
          <DenomArr
            marginImg="0 3px 0 0"
            denomValue={text}
            onlyImg
            tooltipStatusImg={tooltipStatusImg}
          />
        </div>
      )}
      {customText && !text && (
        <div className={styles.containerFormatNumberTokensDenomImg}>
          {customText}
        </div>
      )}
    </div>
  );
}

export default FormatNumberTokens;
