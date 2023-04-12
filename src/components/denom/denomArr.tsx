import { useMemo } from 'react';
import { TraseDenomFuncResponse } from 'src/types/ibc';
import { Option } from 'src/types/common';
import useIbcDenom from 'src/hooks/useIbcDenom';
import Denom from './index';

type DenomArrProps = {
  denomValue: string;
  onlyText?: boolean;
  onlyImg?: boolean;
  tooltipStatusImg?: boolean;
  tooltipStatusText?: boolean;
  type?: 'network';
  size?: number;
};

function DenomArr({
  denomValue,
  onlyText,
  onlyImg,
  tooltipStatusImg,
  tooltipStatusText,
  type,
  size,
}: DenomArrProps) {
  const { traseDenom } = useIbcDenom();

  const useDenomValue = useMemo(() => {
    let denom: Option<TraseDenomFuncResponse[]>;

    if (type === undefined) {
      const denomTrase = traseDenom(denomValue);
      denom = denomTrase;
    }

    if (type === 'network') {
      return (
        <Denom
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={denomValue}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
          type={type}
          infoDenom={{}}
          gap={13}
          size={size}
        />
      );
    }

    if (denom && denom.length === 1) {
      return (
        <Denom
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={denom[0].denom}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
          type={type}
          infoDenom={denom[0]}
          gap={13}
          size={size}
        />
      );
    }

    if (denom && denom.length > 1) {
      return (
        <div style={{ display: 'flex' }}>
          {!onlyText && (
            <>
              <Denom
                type={type}
                denomValue={denom[0].denom}
                onlyImg
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={denom[0]}
                size={size}
              />
              <Denom
                type={type}
                denomValue={denom[1].denom}
                marginContainer={
                  onlyImg ? '0px 0px 0px -12px' : '0px 5px 0px -12px'
                }
                onlyImg
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={denom[1]}
                size={size}
              />
            </>
          )}

          {!onlyImg && (
            <>
              <Denom
                type={type}
                denomValue={denom[0].denom}
                onlyText
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={denom[0]}
                size={size}
              />
              -
              <Denom
                type={type}
                denomValue={denom[1].denom}
                onlyText
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={denom[1]}
                size={size}
              />
            </>
          )}
        </div>
      );
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [denomValue]);

  try {
    return useDenomValue;
    // return <ValueImg text={denom} type={type} {...props} />;
  } catch (error) {
    return <div>{denomValue}</div>;
  }
}

export default DenomArr;
