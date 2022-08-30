import React, { useContext, useEffect, useState } from 'react';
import ValueImg from '../valueImg';
import coinDecimalsConfig from '../../utils/configToken';

function useGetDenom(denomValue) {
  const [denom, setDenom] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (denomValue.includes('ibc')) {
      setType('ibc');
    } else if (denomValue.includes('pool')) {
      setType('pool');
    } else {
      setType('');
    }
  }, [denomValue]);

  useEffect(() => {
    if (
      denomValue.includes('ibc') &&
      Object.hasOwnProperty.call(coinDecimalsConfig, denomValue)
    ) {
      setDenom(coinDecimalsConfig[denomValue].denom);
    } else {
      setDenom(denomValue);
    }
  }, [denomValue]);

  return { denom, type };
}

function Denom({ denomValue, denomData, ...props }) {
  try {
    const { denom, type } = useGetDenom(denomValue);


    return <ValueImg denomData={denomData} text={denom} type={type} {...props} />;
  } catch (error) {
    return <div>{denomValue}</div>;
  }
}

export default Denom;
