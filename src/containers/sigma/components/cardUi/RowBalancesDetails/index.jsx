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
import { DenomArr } from '../../../../../components';

const cx = require('classnames');

function RowBalancesDetails({ balance }) {
  const { traseDenom } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const onClickBtnArrow = () => {
    setIsOpen((item) => !item);
  };

  const checkDetailsToken = useMemo(() => {
    if (
      Object.prototype.hasOwnProperty.call(balance, 'total') &&
      Object.keys(balance).length >= 5
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

  return (
    <div style={{ display: 'grid' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 270px 0.9fr 1fr',
          height: '40px',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <DenomArr denomValue={balance.total.denom} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            alignItems: 'baseline',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={checkDetailsToken ? onClickBtnArrow : null}
            style={{
              display: 'grid',
              gridTemplateColumns: '8px 1fr',
              alignItems: 'center',
              gap: '10px',
              outline: 'none',
              background: 'transparent',
              border: 'none',
              cursor: checkDetailsToken ? 'pointer' : 'default',
            }}
          >
            <BtnArrow open={isOpen} disabled={!checkDetailsToken} />
            <ChartTotal balance={balance} />
          </button>
          <FormatNumberTokens
            styleValue={{ fontSize: '14px' }}
            value={useAmountTotal}
          />
        </div>
        <FormatNumberTokens
          styleValue={{ fontSize: '14px' }}
          text={balance.price.denom}
          value={balance.price.amount}
        />
        <FormatNumberTokens
          styleValue={{ fontSize: '14px' }}
          text={balance.cap.denom}
          value={balance.cap.amount}
        />
      </div>
      {checkDetailsToken && (
        <Transition in={isOpen} timeout={300}>
          {(state) => {
            return (
              <div
                className={cx(styles.containerDetailsBalance, {
                  [styles[`containerDetailsBalance${state}`]]:
                    Object.keys(balance).length === 5,
                  [styles[`containerDetailsBalanceMain${state}`]]:
                    Object.keys(balance).length === 7,
                })}
              >
                <DetailsBalance data={balance} />
              </div>
            );
          }}
        </Transition>
      )}
    </div>
  );
}

export default RowBalancesDetails;
