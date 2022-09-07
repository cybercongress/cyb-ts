import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import s from './styles1.scss';
import { ValueImg } from '../../../../components';

const cx = require('classnames');
const imgSwap = require('../../../../image/exchange-arrows.svg');

const Mark = ({ value }) => {
  let position = '';

  if (value <= 5) {
    position = 'left';
  } else if (value === 10) {
    position = 'center';
  } else {
    position = 'right';
  }

  return (
    <div className={styles.trackMark}>
      <div className={styles.trackMarkBgBlur} />
      <div
        className={cx(
          styles.trackMarkGradient,
          styles[`trackMarkGradient${position}`]
        )}
      />
      <div
        className={cx(styles.trackMarkLabel, {
          [styles.trackMarkLabelColorBlue]: value === 'Max',
        })}
      >
        {value !== 'Max' ? `${value}%` : 'Max'}
      </div>
    </div>
  );
};

export const ButtonIcon = ({ img, disabled, ...props }) => {
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
};

const SpetionLabel = ({ value, lable }) => {
  let position = '';

  if (value <= 3) {
    position = 'left';
  } else if (value === 4) {
    position = 'center';
  } else {
    position = 'right';
  }
  return (
    <label >
      <div className={s.trackMarkBgBlur} />
      {/* <div */}
      {/*   className={cx(s.trackMarkGradient, s[`trackMarkGradient${position}`])} */}
      {/* /> */}

      <div
        className={cx(s.trackMarkLabel, {
          [s.trackMarkLabelColorBlue]: lable === 'Max',
        })}
      >
        {lable !== 'Max' ? `${lable}%` : 'Max'}
      </div>
    </label>
  );
};

const constValue = {
  0: 0,
  2: 0.4336766652213271,
  5: 0.5663233347786729,
  10: 0.6666666666666666,
  20: 0.7670099985546605,
  50: 0.8996566681120063,
  100: 1,
};

export function Slider({ tokenA, tokenB, tokenAAmount, accountBalances, setPercentageBalanceHook, coinReverseAction }) {

  const [valueSilder, setValueSilder] = useState(0);

  const [angle, setAngle] = useState(26);

  // useEffect(() => {
  //   const getAngle = () => {
  //     const minval = 0.1;
  //     const maxval = 100;
  //     const minlog = Math.log10(minval);
  //     const maxlog = Math.log10(maxval);
  //     const range = maxlog - minlog;
  //     console.log(`range`, range);
  //     const lineartolog = (n) => {
  //       return (Math.log10(n) - minlog) / range;
  //     };
  //     const logplots = [0.1, 2, 5, 10, 20, 50, 100].map(lineartolog);
  //     console.log(`logplots`, logplots);
  //   };

  //   getAngle();
  // }, []);

  const onChangeValueEvent=(value)=>{

    console.log('changed value',value)

    if (typeof setPercentageBalanceHook==='function') {
      setPercentageBalanceHook(value)
      } else {
      setValueSilder(value);
    }
  };
  const onClickReverseButton=()=>{
    if (typeof coinReverseAction==='function') {
      coinReverseAction()
      }
  };

  useEffect(() => {
    if (
      tokenA !== '' &&
       accountBalances  &&
      accountBalances[tokenA.toLowerCase()] &&
      parseFloat(tokenAAmount) > 0
    ) {
      const procent = tokenAAmount / accountBalances[tokenA.toLowerCase()];
      // console.log('procent',tokenAAmount,'eeee',procent);
      setValueSilder((procent*100));
      // Math.floor

      
    }
  }, [tokenAAmount, accountBalances, tokenA]);

  useEffect(() => {
    // debtAmountPos
    // console.log('valueSilder',valueSilder);
    // const cof = constValue[valueSilder];
    const cof = (valueSilder)*0.011
    console.log('df',valueSilder,'d',(100/valueSilder),cof)
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
        <div style={{"width":"100%"}}>
          <SpetionLabel value={1} lable="0" />

          <SpetionLabel value={3} lable="10" />

          <SpetionLabel value={3} lable="20" />




          <SpetionLabel value={5} lable="40" />

          <SpetionLabel value={6} lable="60" />
          {/* <SpetionLabel value={6} lable="70" /> */}
          <SpetionLabel value={6} lable="80" />
          {/* <SpetionLabel value={6} lable="90" /> */}

          <SpetionLabel value={7} lable="Max" />
        </div>

        <div style={{"width":"100%"}}>
          <input style={{"width":"100%"}} type="range" min="1" max="100"  value={valueSilder} onChange={(e) => onChangeValueEvent(e.target.value)} />
        </div>





        <div className={s.debtAmountPos} style={{"left": ((valueSilder<60) ? valueSilder+2 : valueSilder-2)+"%"}}>
          {tokenA !== '' && (
            <div
              className={cx(s.debtAmountPosToken, s.debtAmountPosTokenA)}
              style={{ transform: `rotate(${angle}deg)` }}
            >
              {/* //@TODO */}
              {/* <div style={{ transform: `rotate(255deg)` }}>Description element</div> */}
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
          {/* <ButtonIcon */}
          {/*   // onClick={() => onClickReverseButton()} */}
          {/*   // active={selectMethod === 'ledger'} */}
          {/*   img={imgSwap} */}
          {/* /> */}
        </div>
      </div>
    </div>
  );
}

export default Slider;
