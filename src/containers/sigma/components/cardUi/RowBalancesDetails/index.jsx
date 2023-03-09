import React, { useState, useMemo, useContext } from 'react';
import { Transition } from 'react-transition-group';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';
import DetailsBalance from '../DetailsBalance';
import ChartTotal from '../ChartTotal';
import BtnArrow from '../BtnArrow';
import styles from './styles.scss';
import { AppContext } from '../../../../../context';
import { convertAmount, replaceSlash } from '../../../../../utils/utils';
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

  const getTypeDenomKey = (key) => {
    const { denom } = traseDenom(key);

    if (denom.includes('ibc')) {
      return replaceSlash(denom);
    }

    if (key.includes('pool')) {
      return `${getTypeDenomKey(denom[0].denom)}-${getTypeDenomKey(
        denom[1].denom
      )}`;
    }

    return denom;
  };

  const getLinktoSearch = (key) => {
    return `/search/${getTypeDenomKey(key)}`;
  };

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
        <Link to={getLinktoSearch(balance.total.denom)}>
          <DenomArr denomValue={balance.total.denom} />
        </Link>

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
            {checkDetailsToken ? <BtnArrow open={isOpen} /> : <div />}
            <ChartTotal balance={balance} />
          </button>
          <FormatNumberTokens value={useAmountTotal} />
        </div>
        <FormatNumberTokens
          text={balance.price.denom}
          value={balance.price.amount}
        />
        <FormatNumberTokens
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
                  [styles[`containerDetailsBalanceMainComm${state}`]]:
                    Object.keys(balance).length === 8,
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
