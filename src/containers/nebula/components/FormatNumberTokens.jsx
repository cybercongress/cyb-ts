import React from 'react';
import { DenomArr } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import styles from '../styles.scss';

const getDecimal = (number) => {
  const nstring = number.toString();
  const narray = nstring.split('.');
  const result = narray.length > 1 ? `.${narray[1].slice(0, 3)}` : '';
  return result;
};

const FormatNumberTokens = ({ text, value, tooltipStatusImg, ...props }) => {
  const decimal = getDecimal(value);
  return (
    <div
      style={{ gridTemplateColumns: '1fr 30px' }}
      className={styles.containerFormatNumberTokens}
      {...props}
    >
      <div className={styles.containerFormatNumberTokensNumber}>
        <span>{formatNumber(Math.floor(value))}</span>
        <span className={styles.containerFormatNumberTokensNumberDecimal}>
          {decimal}
        </span>
      </div>
      {text && (
        <div className={styles.containerFormatNumberTokensDenomImg}>
          <DenomArr
            marginImg="0 3px 0 0"
            flexDirection="row-reverse"
            justifyContent="flex-end"
            denomValue={text}
            onlyImg
            tooltipStatusImg={tooltipStatusImg}
          />
        </div>
      )}
    </div>
  );
};

export default FormatNumberTokens;
