import React, { useContext, useEffect, useState, useMemo } from 'react';
import Denom from './index';
import coinDecimalsConfig from '../../utils/configToken';

const denonFnc = (text) => {
  let denom = text;

  if (
    Object.prototype.hasOwnProperty.call(coinDecimalsConfig, text) &&
    text.includes('pool')
  ) {
    const poolDenoms = coinDecimalsConfig[text].denom;
    denom = [denonFnc(poolDenoms[0]), denonFnc(poolDenoms[1])];
  }
  return denom;
};

function DenomArr({
  denomValue,
  onlyText,
  onlyImg,
  tooltipStatusImg,
  tooltipStatusText,
  ...props
}) {
  const useDenomValue = useMemo(() => {
    const resultDenom = denonFnc(denomValue);
    if (typeof resultDenom === 'string') {
      return (
        <Denom
          {...props}
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={resultDenom}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
        />
      );
    }

    if (typeof resultDenom === 'object') {
      return (
        <div style={{ display: 'flex' }}>
          <Denom
            denomValue={resultDenom[0]}
            onlyImg={onlyImg}
            onlyText={onlyText}
            tooltipStatusImg={tooltipStatusImg}
            {...props}
          />
          {onlyText ? '-' : ''}
          <Denom
            denomValue={resultDenom[1]}
            marginContainer={onlyImg ? '0px 0px 0px -12px' : '0px'}
            onlyImg={onlyImg}
            onlyText={onlyText}
            tooltipStatusImg={tooltipStatusImg}
            {...props}
          />
        </div>
      );
    }
    return null;
  }, [denomValue]);

  try {
    return useDenomValue;
    // return <ValueImg text={denom} type={type} {...props} />;
  } catch (error) {
    return <div>{denomValue}</div>;
  }
}

export default DenomArr;
