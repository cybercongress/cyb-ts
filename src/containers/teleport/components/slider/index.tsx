import React, { useState, useEffect, useCallback, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { getDisplayAmountReverce } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';

import cx from 'classnames';
import SliderComponent, { SliderProps } from 'rc-slider';
import { FormatNumberTokens } from 'src/containers/nebula/components';

import { DenomArr } from '../../../../components';
import imgSwap from '../../../../image/exchange-arrows.svg';
import 'rc-slider/assets/index.css';
import s from './styles.module.scss';
import './styles.override.css';

// REFACT: Move outside or reuse
export function ButtonIcon({
  img,
  disabled,
  onClick,
  ...props
}: {
  img: string;
  disabled?: boolean;
  props: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={s.buttonIcon}
      disabled={disabled}
      onMouseUp={onClick}
      {...props}
    >
      <img src={img} alt="img" />
    </button>
  );
}

function SpetionLabel({ value }: { value: number }) {
  let position = '';

  if (value <= 5) {
    position = 'left';
  } else if (value === 10) {
    position = 'center';
  } else {
    position = 'right';
  }
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={s.trackLabel}>
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

const SphereValueMemo = React.memo(SphereValue);

const angleDeg = 135;
const minlVal = Math.log(1);
const maxlVal = Math.log(100);

const scale = (maxlVal - minlVal) / 100;

const scalePercents = [0, 2, 5, 10, 20, 50, 100];

const positionToPercents = (position: number) =>
  position === 0 ? 0 : Math.round(Math.exp(minlVal + scale * position));

const percentsToPosition = (percents: number) =>
  (Math.log(percents) - minlVal) / scale;

const scaleMarks = Object.fromEntries(
  scalePercents.map((percents) => [
    percentsToPosition(percents),
    <SpetionLabel key={`slider_mark_${percents}`} value={percents} />,
  ])
);

function Slider({
  tokenA,
  tokenB,
  tokenAAmount,
  accountBalances,
  setPercentageBalanceHook,
  coinReverseAction,
  pairPrice,
}: {
  tokenA: string;
  tokenB?: string;
  tokenAAmount: string;
  accountBalances: any;
  setPercentageBalanceHook?: (value: number) => void;
  coinReverseAction?: () => void;
  pairPrice?: { to: number; from: number };
}) {
  const { traseDenom } = useIbcDenom();
  const [valueSilder, setValueSilder] = useState(0);
  const [currentPercents, setCurrentPercent] = useState(0);
  const beforePercents = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const resetDragging = useCallback(() => setIsDragging(false), []);

  const onClickReverseButton = useCallback(
    () => !isDragging && coinReverseAction && coinReverseAction(),
    [coinReverseAction, isDragging]
  );

  useEffect(() => {
    if (beforePercents.current !== currentPercents) {
      setIsDragging(true);
    }
    beforePercents.current = currentPercents;
  }, [currentPercents]);

  useEffect(() => {
    setIsDisabled(
      !(
        accountBalances &&
        accountBalances[tokenA] &&
        accountBalances[tokenA] > 0
      )
    );

    if (
      tokenA &&
      accountBalances &&
      accountBalances[tokenA] &&
      parseFloat(tokenAAmount) &&
      traseDenom
    ) {
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const amountTokenA = getDisplayAmountReverce(tokenAAmount, coinDecimalsA);

      const percents = new BigNumber(amountTokenA)
        .dividedBy(accountBalances[tokenA])
        .multipliedBy(100)
        .toNumber();

      if (percents > 100) {
        setCurrentPercent(100);
        setValueSilder(100);
        return;
      }

      setCurrentPercent(Math.round(percents));

      const position = percentsToPosition(percents);

      setValueSilder(position < 0 ? 1 : position);
    } else {
      setValueSilder(0);
      setCurrentPercent(0);
    }
  }, [tokenAAmount, accountBalances, tokenA, traseDenom]);

  const onSliderChange = (position: number) => {
    requestAnimationFrame(() => {
      const value = positionToPercents(position);

      setCurrentPercent(value);

      if (setPercentageBalanceHook) {
        setPercentageBalanceHook(value);
      } else {
        setValueSilder(value);
      }
    });
  };

  const renderCustomHandle: SliderProps['handle'] = ({ value }) => {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={s.debtAmountPos}
        style={{
          left: `${value}%`,
        }}
        onMouseUp={() => resetDragging()}
        onTouchEnd={() => resetDragging()}
      >
        <SphereValueMemo angle={90}>
          <div>{currentPercents}%</div>
        </SphereValueMemo>
        {tokenA && tokenB && (
          <>
            <SphereValueMemo angle={angleDeg}>
              <DenomArr denomValue={tokenA} onlyImg />
              {pairPrice !== undefined && (
                <div className={s.imgValue}>
                  <FormatNumberTokens value={pairPrice.to} />
                </div>
              )}
            </SphereValueMemo>

            <SphereValueMemo angle={-angleDeg}>
              <DenomArr denomValue={tokenB} onlyImg />
              {pairPrice !== undefined && (
                <div className={s.imgValue}>
                  <FormatNumberTokens value={pairPrice.from} />
                </div>
              )}
            </SphereValueMemo>
          </>
        )}
        <ButtonIcon onClick={() => onClickReverseButton()} img={imgSwap} />
      </div>
    );
  };

  return (
    <div className={s.formWrapper}>
      <div className={s.debtAmountSlider}>
        <div style={{ width: '100%', padding: '0 25px' }}>
          <SliderComponent
            disabled={isDisabled}
            value={valueSilder}
            min={0}
            max={100}
            step={1}
            handle={renderCustomHandle}
            onChange={(pos) => onSliderChange(pos)}
            marks={scaleMarks}
            trackStyle={{ backgroundColor: '#C5C5C5', height: '2px' }}
            railStyle={{ backgroundColor: '#C5C5C5', height: '2px' }}
            dotStyle={{
              background: 'none',
              border: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Slider;
