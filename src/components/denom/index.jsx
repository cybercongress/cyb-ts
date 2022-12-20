import React from 'react';
import CoinDenom from '../valueImg/textDenom';
import ImgDenom from '../valueImg/imgDenom';
import ImgNetwork from '../networksImg/imgNetwork';
import TextNetwork from '../networksImg/textNetwork';

const ContainerDenom = ({
  justifyContent,
  marginContainer,
  flexDirection,
  gap,
  children,
}) => (
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
    {children}
  </div>
);

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
  type,
  ...props
}) {
  if (type && type === 'network') {
    return (
      <ContainerDenom
        justifyContent={justifyContent}
        marginContainer={marginContainer}
        flexDirection={flexDirection}
        gap={gap}
        {...props}
      >
        {!onlyImg && (
          <TextNetwork
            network={denomValue}
            tooltipStatus={onlyText && tooltipStatusText}
          />
        )}
        {!onlyText && (
          <ImgNetwork
            network={denomValue}
            tooltipStatus={onlyImg && tooltipStatusImg}
          />
        )}
      </ContainerDenom>
    );
  }
  return (
    <ContainerDenom
      justifyContent={justifyContent}
      marginContainer={marginContainer}
      flexDirection={flexDirection}
      gap={gap}
      {...props}
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
    </ContainerDenom>
  );
}

export default Denom;
