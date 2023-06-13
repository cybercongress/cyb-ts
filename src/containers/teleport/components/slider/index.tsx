import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import s from './styles1.scss';
import { ValueImg } from '../../../../components';
import { getDisplayAmountReverce } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';

const cx = require('classnames');
const imgSwap = require('../../../../image/exchange-arrows.svg');

export function ButtonIcon({ img, disabled, ...props }) {
  return (
    <button
      type="button"
      className={s.buttonIcon}
      disabled={disabled}
      {...props}
    >
      <img src={img} alt="img" />
    </button>
  );
}

function SpetionLabel({ value }) {
  let position = '';

  if (value <= 5) {
    position = 'left';
  } else if (value === 10) {
    position = 'center';
  } else {
    position = 'right';
  }
  return (
    <label>
      <div className={s.trackMarkBgBlur} />
      <div
        className={cx(s.trackMarkGradient, s[`trackMarkGradient${position}`])}
      />

      <div
        className={cx(s.trackMarkLabel, {
          [s.trackMarkLabelColorBlue]: value === 100,
        })}
      >
        {value < 100 ? `${value}%` : 'Max'}
      </div>
    </label>
  );
}

function SphereValue({
  angle,
  children,
}: {
  angle: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(s.debtAmountPosToken)}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div
        className={s.debtAmountPosTokenObj}
        style={{ transform: `rotate(${angle * -1}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}

const angleDeg = 135;

function Slider({
  tokenA,
  tokenB,
  tokenAAmount,
  accountBalances,
  setPercentageBalanceHook,
  coinReverseAction,
  getPrice,
}) {
  const { traseDenom } = useIbcDenom();
  const [valueSilder, setValueSilder] = useState(0);
  const [currentProcent, setCurrentProcent] = useState(0);
  const minpos = 0;
  const maxpos = 100;
  const minval = Math.log(1);
  const maxval = Math.log(100);
  const scale = (maxval - minval) / (maxpos - minpos);

  const onClickReverseButton = () => {
    if (typeof coinReverseAction === 'function') {
      coinReverseAction();
    }
  };

  useEffect(() => {
    if (
      tokenA &&
      accountBalances &&
      accountBalances[tokenA] &&
      parseFloat(tokenAAmount) &&
      traseDenom
    ) {
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const amountTokenA = getDisplayAmountReverce(tokenAAmount, coinDecimalsA);

      const procent = new BigNumber(amountTokenA)
        .dividedBy(accountBalances[tokenA])
        .multipliedBy(100)
        .toNumber();

      if (procent > 100) {
        setCurrentProcent(Math.round(100));
        setValueSilder(100);
        return;
      }
      setCurrentProcent(Math.round(procent));

      const position = minpos + (Math.log(procent) - minval) / scale;
      if (position < 0) {
        setValueSilder(1);
        return;
      }
      setValueSilder(position);
    } else {
      setValueSilder(0);
      setCurrentProcent(0);
    }
  }, [tokenAAmount, accountBalances, tokenA]);

  // useEffect(() => {
  //   const cof = valueSilder * 0.011;
  //   console.log('df', valueSilder, 'd', 100 / valueSilder, cof);
  //   const angleDeg = cof * 155;
  //   if (angleDeg > 0) {
  //     setAngle(angleDeg);
  //   } else {
  //     setAngle(26);
  //   }
  // }, [valueSilder]);

  const onInputValueEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseFloat(e.target.value);
    let value = 0;
    if (position === 0) {
      value = 0;
    } else {
      value = Math.round(Math.exp(minval + scale * (position - minpos)));
    }

    setCurrentProcent(value);

    if (typeof setPercentageBalanceHook === 'function') {
      setPercentageBalanceHook(value);
    } else {
      setValueSilder(value);
    }
  };

  return (
    <div className={s.formWrapper}>
      <div className={s.debtAmountSlider}>
        <div style={{ width: '100%' }}>
          <SpetionLabel value={0} />

          <SpetionLabel value={2} />

          <SpetionLabel value={5} />

          <SpetionLabel value={10} />

          <SpetionLabel value={20} />

          <SpetionLabel value={50} />

          <SpetionLabel value={100} />
        </div>

        <div style={{ width: '100%' }}>
          <input
            style={{ width: '100%', padding: '0 30px' }}
            type="range"
            min="0"
            max="100"
            value={valueSilder}
            onInput={(e) => onInputValueEvent(e)}
            // onChange={(e) => onChangeValueEvent(e.target.value)}
          />
        </div>
        <div
          style={{
            width: '100%',
            padding: '0 30px',
            display: 'flex',
            position: 'relative',
            height: '1px',
          }}
        >
          <div
            className={s.debtAmountPos}
            style={{
              left: `${valueSilder}%`,
            }}
          >
            <SphereValue angle={90}>
              <div>{currentProcent}%</div>
            </SphereValue>
            {tokenA && tokenB && (
              <SphereValue angle={angleDeg}>
                <ValueImg text={tokenA} onlyImg />
                {getPrice.to !== undefined && (
                  <div className={s.imgValue}>{getPrice.to}</div>
                )}
              </SphereValue>
            )}
            {tokenB && tokenA && (
              <SphereValue angle={-angleDeg}>
                <ValueImg text={tokenB} onlyImg />
                {getPrice.from !== undefined && (
                  <div className={s.imgValue}>{getPrice.from}</div>
                )}
              </SphereValue>
            )}
            <ButtonIcon onClick={() => onClickReverseButton()} img={imgSwap} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
