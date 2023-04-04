import React from 'react';
import CoinDenom from '../valueImg/textDenom';
import ImgDenom from '../valueImg/imgDenom';
import ImgNetwork from '../networksImg/imgNetwork';
import TextNetwork from '../networksImg/textNetwork';

type DenomProps = {
  denomValue: string;
  onlyText?: boolean;
  onlyImg?: boolean;
  tooltipStatusImg?: boolean;
  tooltipStatusText?: boolean;
  marginContainer?: string,
  justifyContent?: string,
  flexDirection?: string,
  gap?: number,
  infoDenom?: any,
  type?: string,
  size?: number,
}

function ContainerDenom({
  justifyContent,
  marginContainer,
  flexDirection,
  gap,
  children,
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
      {children}
    </div>
  );
}

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
  infoDenom,
  type,
  size,
}: DenomProps) {
  if (type && type === 'network') {
    return (
      <ContainerDenom
        justifyContent={justifyContent}
        marginContainer={marginContainer}
        flexDirection={flexDirection}
        gap={gap}
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
            size={size}
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
    >
      {!onlyText && (
        <ImgDenom
          coinDenom={denomValue}
          infoDenom={infoDenom}
          tooltipStatus={tooltipStatusImg}
          size={size}
        />
      )}
      {!onlyImg && (
        <CoinDenom
          coinDenom={denomValue}
          tooltipStatus={onlyText && tooltipStatusText}
          infoDenom={infoDenom}
        />
      )}
    </ContainerDenom>
  );
}

export default Denom;
