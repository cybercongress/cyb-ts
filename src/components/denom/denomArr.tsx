import { useContext, useMemo } from 'react';
import Denom from './index';
import { AppContext } from '../../context';
import { $TsFixMe } from 'src/types/tsfix';

type DenomArrProps = {
  denomValue: $TsFixMe;
  onlyText?: boolean;
  onlyImg?: boolean;
  tooltipStatusImg?: boolean;
  tooltipStatusText?: boolean;
  type?: string;
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
  const { traseDenom } = useContext(AppContext);

  const useDenomValue = useMemo(() => {
    let denom: $TsFixMe = denomValue;
    let infoDenomTemp;

    if (type === undefined) {
      const infoDenom = traseDenom(denomValue);
      const { denom: denomTrase } = infoDenom;
      denom = denomTrase;
      infoDenomTemp = { ...infoDenom };
    }

    if (typeof denom === 'string') {
      return (
        <Denom
          onlyImg={onlyImg}
          onlyText={onlyText}
          denomValue={denom}
          tooltipStatusImg={tooltipStatusImg}
          tooltipStatusText={tooltipStatusText}
          type={type}
          infoDenom={infoDenomTemp}
          gap={13}
          size={size}
        />
      );
    }

    if (typeof denom === 'object') {
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
                infoDenom={infoDenomTemp.denom[0]}
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
                infoDenom={infoDenomTemp.denom[1]}
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
                infoDenom={infoDenomTemp.denom[0]}
                size={size}
              />
              -
              <Denom
                type={type}
                denomValue={denom[1].denom}
                onlyText
                tooltipStatusImg={tooltipStatusImg}
                tooltipStatusText={tooltipStatusText}
                infoDenom={infoDenomTemp.denom[1]}
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
