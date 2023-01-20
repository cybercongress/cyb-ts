import React, { useState, useMemo, useContext } from 'react';
import { Transition } from 'react-transition-group';
import BigNumber from 'bignumber.js';
import DetailsBalance from '../DetailsBalance';
import ChartTotal from '../ChartTotal';
import BtnArrow from '../BtnArrow';
import styles from './styles.scss';
import { AppContext } from '../../../../../context';
import { convertAmount } from '../../../../../utils/utils';
import { CYBER } from '../../../../../utils/config';
import { FormatNumberTokens } from '../../../../nebula/components';

const cx = require('classnames');

function RowBalancesDetails({ balance }) {
  const { traseDenom, marketData } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const onClickBtnArrow = () => {
    setIsOpen((item) => !item);
  };

  const checkDetailsToken = useMemo(() => {
    if (
      Object.prototype.hasOwnProperty.call(balance, 'total') &&
      Object.keys(balance).length >= 3
    ) {
      return true;
    }

    return false;
  }, [balance]);

  // console.log('balance', balance)

  const useAmountTotal = useMemo(() => {
    if (balance.total) {
      const { amount, denom } = balance.total;

      const { coinDecimals } = traseDenom(denom);

      return convertAmount(amount, coinDecimals);
    }

    return 0;
  }, [balance]);

  const usePriceTotal = useMemo(() => {
    if (balance.total) {
      const { denom } = balance.total;

      if (Object.prototype.hasOwnProperty.call(marketData, denom)) {
        return marketData[denom];
      }
    }

    return 0;
  }, [balance, marketData]);

  const useCapTotal = useMemo(() => {
    return new BigNumber(useAmountTotal)
      .multipliedBy(usePriceTotal)
      .dp(0, BigNumber.ROUND_FLOOR)
      .toNumber();
  }, [useAmountTotal, usePriceTotal]);

  return (
    <div style={{ display: 'grid' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 1fr',
          height: '40px',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClickBtnArrow}
            style={{
              display: 'grid',
              gridTemplateColumns: '8px 1fr',
              alignItems: 'center',
              gap: '10px',
              outline: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <BtnArrow open={isOpen} disabled={!checkDetailsToken} />
            <ChartTotal balance={balance} />
          </button>
          <FormatNumberTokens
            text={balance.total.denom}
            value={useAmountTotal}
          />
        </div>
        <FormatNumberTokens
          text={CYBER.DENOM_LIQUID_TOKEN}
          value={usePriceTotal}
        />
        <FormatNumberTokens
          text={CYBER.DENOM_LIQUID_TOKEN}
          value={useCapTotal}
        />
      </div>
      {checkDetailsToken && (
        <Transition in={isOpen} timeout={300}>
          {(state) => {
            return (
              <div
                className={cx(styles.containerDetailsBalance, {
                  [styles[`containerDetailsBalance${state}`]]:
                    Object.keys(balance).length === 3,
                  [styles[`containerDetailsBalanceMain${state}`]]:
                    Object.keys(balance).length === 5,
                })}
              >
                <DetailsBalance data={balance} usePriceTotal={usePriceTotal} />
              </div>
            );
          }}
        </Transition>
      )}
    </div>
  );
}

export default RowBalancesDetails;
