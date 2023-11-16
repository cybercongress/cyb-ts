import React, { useState, useEffect, useCallback, useRef } from 'react';

import cx from 'classnames';
import SliderComponent, { SliderProps as RcSliderProps } from 'rc-slider';
import { FormatNumberTokens, DenomArr } from 'src/components';
import imgSwap from 'src/image/exchange-arrows.svg';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import './styles.override.css';

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
    <label className={styles.trackLabel}>
      <div className={styles.trackMarkBgBlur} />
      <div
        className={cx(
          styles.trackMarkGradient,
          styles[`trackMarkGradient${position}`]
        )}
      />

      <div
        className={cx(styles.trackMarkLabel, {
          [styles.trackMarkLabelColorBlue]: value === 100,
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
      className={cx(styles.debtAmountPosToken)}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div
        className={styles.debtAmountPosTokenObj}
        style={{ transform: `rotate(${angle * -1}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}

const SphereValueMemo = React.memo(SphereValue);

function SphereValueWithToken({
  tokenName,
  angle,
  price,
}: {
  tokenName: string;
  angle: number;
  price?: number;
}) {
  return (
    <SphereValueMemo angle={angle}>
      <DenomArr denomValue={tokenName} onlyImg />
      {price && (
        <div className={styles.imgValue}>
          <FormatNumberTokens value={price} />
        </div>
      )}
    </SphereValueMemo>
  );
}

type TokenPair = {
  tokenA: string;
  tokenB: string;
  priceA: number;
  priceB: number;
};

// type SliderHandleProps = {
//   disabled: boolean;
//   onClickRelease: () => void;
//   onSwapClick?: () => void;
//   percents: number;
//   tokenPair?: TokenPair;
//   value: number;
// } & RcSliderProps['handle'];

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

export type SliderProps = {
  onChange: (value: number) => void;
  onSwapClick?: () => void;
  valuePercents: number;
  disabled?: boolean;
  tokenPair?: TokenPair;
};

function Slider({
  onChange,
  onSwapClick,
  valuePercents,
  disabled,
  tokenPair,
}: SliderProps) {
  const [valueSilder, setValueSilder] = useState(0);
  const [currentPercents, setCurrentPercent] = useState(0);
  const beforePercents = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const resetDragging = useCallback(() => setIsDragging(false), []);

  const onClickSwapDirection = useCallback(
    () => !isDragging && onSwapClick && onSwapClick(),
    [onSwapClick, isDragging]
  );

  useEffect(() => {
    if (beforePercents.current !== currentPercents) {
      setIsDragging(true);
    }
    beforePercents.current = currentPercents;
  }, [currentPercents]);

  useEffect(() => {
    const percents = Math.round(valuePercents || 0);
    if (percents > 100) {
      setCurrentPercent(100);
      setValueSilder(100);
      return;
    }
    if (percents <= 0) {
      setValueSilder(0);
      setCurrentPercent(0);
      return;
    }

    setCurrentPercent(percents);

    const position = percentsToPosition(percents);

    setValueSilder(position < 0 ? 1 : position);
  }, [valuePercents]);

  const onSliderChange = (position: number) => {
    requestAnimationFrame(() => {
      const value = positionToPercents(position);
      setValueSilder(position);
      setCurrentPercent(value);

      onChange && onChange(value);
    });
  };
  const renderCustomHandle: RcSliderProps['handle'] = useCallback(
    ({ value }) => {
      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={styles.debtAmountPos}
          style={{
            left: `${value}%`,
          }}
          onMouseUp={() => resetDragging()}
          onTouchEnd={() => resetDragging()}
        >
          <SphereValueMemo angle={90}>
            <div>{currentPercents}%</div>
          </SphereValueMemo>
          {tokenPair && (
            <>
              <SphereValueWithToken
                tokenName={tokenPair.tokenA}
                angle={angleDeg}
                price={tokenPair.priceA}
              />
              <SphereValueWithToken
                tokenName={tokenPair.tokenB}
                angle={-angleDeg}
                price={tokenPair.priceB}
              />
            </>
          )}
          <button
            type="button"
            className={styles.buttonIcon}
            disabled={disabled}
            onMouseUp={() => onClickSwapDirection()}
            onTouchEnd={() => onClickSwapDirection()}
          >
            <img src={imgSwap} alt="swap" />
          </button>
        </div>
      );
    },
    [
      tokenPair,
      currentPercents,
      disabled,
      resetDragging,
      onClickSwapDirection,
      onSwapClick,
    ]
  );

  return (
    <div className={styles.formWrapper}>
      <div className={styles.debtAmountSlider}>
        <div style={{ width: '100%', padding: '0 25px' }}>
          <SliderComponent
            disabled={!!disabled}
            value={valueSilder}
            min={0}
            max={100}
            step={0.5}
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
