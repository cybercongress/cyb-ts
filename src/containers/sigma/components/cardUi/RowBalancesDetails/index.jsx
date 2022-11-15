import React, { useState, useMemo } from 'react';
import { Transition } from 'react-transition-group';
import DetailsBalance from '../DetailsBalance';
import ChartTotal from '../ChartTotal';
import FormatNumberTokens from '../FormatNumberTokens';
import BtnArrow from '../BtnArrow';
import styles from './styles.scss';

const cx = require('classnames');

function RowBalancesDetails({ balance }) {
  const [isOpen, setIsOpen] = useState(false);

  const onClickBtnArrow = () => {
    setIsOpen((item) => !item);
  };

  const checkDetailsToken = useMemo(() => {
    if (Object.prototype.hasOwnProperty.call(balance, 'total')) {
      return true;
    }

    return false;
  }, [balance]);

  return (
    <div style={{ display: 'grid' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '8px 1fr',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <BtnArrow
              open={isOpen}
              disabled={!checkDetailsToken}
              onClick={onClickBtnArrow}
            />
            <ChartTotal balance={balance} />
          </div>
          <FormatNumberTokens
            text={checkDetailsToken ? balance.total.denom : balance.denom}
            value={checkDetailsToken ? balance.total.amount : balance.amount}
          />
        </div>
        <div style={{ justifySelf: 'end' }}>0</div>
      </div>
      {checkDetailsToken && (
        <Transition in={isOpen} timeout={500}>
          {(state) => {
            return (
              <div
                className={cx(
                  styles.containerDetailsBalance,
                  styles[`containerDetailsBalance${state}`]
                )}
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
