import { useState, useEffect } from 'react';
import s from './styles1.scss';
import { ValueImg } from '../../../../components';

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

function SpetionLabel({ value, lable }) {
  let position = '';

  if (value <= 3) {
    position = 'left';
  } else if (value === 4) {
    position = 'center';
  } else {
    position = 'right';
  }
  return (
    <label htmlFor={value} className={s.trackMark}>
      {/* <div className={s.trackMarkBgBlur} /> */}
      <div
        className={cx(s.trackMarkGradient, s[`trackMarkGradient${position}`])}
      />

      <div
        className={cx(s.trackMarkLabel, {
          [s.trackMarkLabelColorBlue]: lable === 'Max',
        })}
      >
        {lable !== 'Max' ? `${lable}%` : 'Max'}
      </div>
    </label>
  );
}

const constValue = {
  0: 0,
  2: 0.4336766652213271,
  5: 0.5663233347786729,
  10: 0.6666666666666666,
  20: 0.7670099985546605,
  50: 0.8996566681120063,
  100: 1,
};

function Slider({ tokenA, tokenB, tokenAAmount, accountBalances }) {
  const [valueSilder, setValueSilder] = useState(0);
  const [angle, setAngle] = useState(26);

  useEffect(() => {
    if (
      tokenA !== '' &&
      accountBalances[tokenA] &&
      parseFloat(tokenAAmount) > 0
    ) {
      const procent = tokenAAmount / accountBalances[tokenA];
      setValueSilder(Math.floor(procent));
    }
  }, [tokenAAmount, accountBalances, tokenA]);

  useEffect(() => {
    const cof = constValue[valueSilder];
    const angleDeg = cof * 155;
    if (angleDeg > 0) {
      setAngle(angleDeg);
    } else {
      setAngle(26);
    }
  }, [valueSilder]);

  return (
    <div className={s.formWrapper}>
      <div className={s.debtAmountSlider}>
        <input
          type="radio"
          name="debt-amount"
          id="1"
          value="0"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={1} lable="0" />
        <input
          type="radio"
          name="debt-amount"
          id="2"
          value="2"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={2} lable="2" />
        <input
          type="radio"
          name="debt-amount"
          id="3"
          value="5"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={3} lable="5" />
        <input
          type="radio"
          name="debt-amount"
          id="4"
          value="10"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={4} lable="10" />
        <input
          type="radio"
          name="debt-amount"
          id="5"
          value="20"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={5} lable="20" />
        <input
          type="radio"
          name="debt-amount"
          id="6"
          value="50"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={6} lable="50" />
        <input
          type="radio"
          name="debt-amount"
          id="7"
          value="100"
          onChange={(e) => setValueSilder(e.target.value)}
          required
        />
        <SpetionLabel value={7} lable="Max" />
        <div className={s.debtAmountPos}>
          {tokenA !== '' && (
            <div
              className={cx(s.debtAmountPosToken, s.debtAmountPosTokenA)}
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className={s.debtAmountPosTokenObjA}
                style={{ transform: `rotate(-${angle}deg)` }}
              >
                <ValueImg text={tokenA} onlyImg />
              </div>
            </div>
          )}
          {tokenB !== '' && (
            <div
              className={cx(s.debtAmountPosToken, s.debtAmountPosTokenB)}
              style={{ transform: `rotate(-${angle}deg)` }}
            >
              <div
                className={s.debtAmountPosTokenObjB}
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <ValueImg text={tokenB} onlyImg />
              </div>
            </div>
          )}
          <ButtonIcon
            // onClick={() => tokenChange()}
            // active={selectMethod === 'ledger'}
            img={imgSwap}
          />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default Slider;
