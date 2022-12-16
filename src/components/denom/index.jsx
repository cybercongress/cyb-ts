import React from 'react';
import CoinDenom from '../valueImg/textDenom';
import ImgDenom from '../valueImg/imgDenom';

function Denom({
  denomValue,
  onlyText,
  onlyImg,
  marginContainer,
  justifyContent,
  flexDirection,
  gap,
  tooltipStatusImg = true,
  tooltipStatusText = true,
  ...props
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: justifyContent || 'flex-start',
        margin: marginContainer || 0,
        flexDirection: flexDirection || 'unset',
        gap: gap || 5,
      }}
    >
      {!onlyImg && (
        <CoinDenom
          coinDenom={denomValue}
          tooltipStatus={onlyText && tooltipStatusText}
        />
      )}
      {!onlyText && (
        <ImgDenom
          coinDenom={denomValue}
          tooltipStatus={onlyImg && tooltipStatusImg}
        />
      )}
    </div>
  );
}

export default Denom;
