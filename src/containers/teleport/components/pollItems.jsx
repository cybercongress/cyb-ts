import React, { useMemo, useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import { Denom } from '../../../components';
import FormatNumberTokens from '../../nebula/components/FormatNumberTokens';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';

const PoolItemsList = ({ assets, token, ...props }) => {
  const { marketData } = useContext(AppContext);

  const amounToken = useMemo(() => {
    if (assets && Object.prototype.hasOwnProperty.call(assets, token)) {
      const amount = assets[token];
      return amount;
    }
    return 0;
  }, [assets, token]);

  const usePrice = useMemo(() => {
    if (
      Object.keys(marketData).length > 0 &&
      Object.prototype.hasOwnProperty.call(marketData, token)
    ) {
      const price = new BigNumber(marketData[token]);
      return price.toNumber();
    }
    return 0;
  }, [token, marketData]);

  const useCap = useMemo(() => {
    if (usePrice > 0) {
      return new BigNumber(amounToken)
        .multipliedBy(usePrice)
        .dp(0, BigNumber.ROUND_FLOOR)
        .toNumber();
    }
    return 0;
  }, [amounToken, usePrice]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 0.9fr 1fr',
        gap: '10px',
        alignItems: 'baseline',
        height: '40px',
      }}
    >
      <Denom
        style={{
          flexDirection: 'row-reverse',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        denomValue={token}
        onlyText
        marginImg="0 5px"
      />
      <FormatNumberTokens
        marginContainer="0px"
        value={amounToken}
        text={token}
      />
      <FormatNumberTokens
        marginContainer="0px"
        value={usePrice}
        text={CYBER.DENOM_LIQUID_TOKEN}
      />
      <FormatNumberTokens
        marginContainer="0px"
        value={useCap}
        text={CYBER.DENOM_LIQUID_TOKEN}
      />
    </div>
  );
};

export default PoolItemsList;
