import React, { useContext, useEffect, useState, useMemo } from 'react';
import Denom from './index';
import coinDecimalsConfig from '../../utils/configToken';

const denonFnc = (text) => {
  let denom = text;
  const validDenom = text.includes('ibc') || text.includes('pool');
  if (
    Object.prototype.hasOwnProperty.call(coinDecimalsConfig, text) &&
    validDenom
  ) {
    denom = coinDecimalsConfig[text].denom;
  }
  return denom;
};

function DenomArr({ denomValue, denomData, ...props }) {
  const useDenomValue = useMemo(() => {
    const resultDenom = denonFnc(denomValue);

    if (typeof resultDenom === 'string') {
      { return <Denom {...props} denomData={denomData} denomValue={resultDenom} />; }
    }

    if (typeof resultDenom === 'object') {
      return (
        <div style={{ display: 'flex' }}>
          <Denom denomData={denomData} denomValue={resultDenom[0]} {...props} />
          <Denom denomData={denomData} denomValue={resultDenom[1]} {...props} />
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
