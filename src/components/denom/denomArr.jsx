import React, { useContext, useEffect, useState, useMemo } from 'react';
import Denom from './index';
import { AppContext } from '../../context';

function DenomArr({
  denomValue,
  onlyText,
  onlyImg,
  tooltipStatusImg,
  tooltipStatusText,
  type,
  ...props
}) {
  const { traseDenom } = useContext(AppContext);

  const useDenomValue = useMemo(() => {
    let denom = denomValue;

    if (denomValue.includes('pool')) {
      const { denom: denomTrase } = traseDenom(denomValue);
      denom = denomTrase;
    }

    if (typeof denom === 'string') {
      return (
        <Denom
          {...props}
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={denom}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
          type={type}
        />
      );
    }

    if (typeof denom === 'object') {
      return (
        <div style={{ display: 'flex' }}>
          <Denom
            type={type}
            denomValue={denom[0]}
            onlyImg={onlyImg}
            onlyText={onlyText}
            tooltipStatusImg={tooltipStatusImg}
            tooltipStatusText={tooltipStatusText}
            {...props}
          />
          {onlyText ? '-' : ''}
          <Denom
            type={type}
            denomValue={denom[1]}
            marginContainer={onlyImg ? '0px 0px 0px -12px' : '0px'}
            onlyImg={onlyImg}
            onlyText={onlyText}
            tooltipStatusImg={tooltipStatusImg}
            tooltipStatusText={tooltipStatusText}
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
