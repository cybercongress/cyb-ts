import { useMemo } from 'react';
import { isNative } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import rectangle from 'images/rectangle.svg';
import { DenomArr } from 'src/components';
import { Link } from 'react-router-dom';
import useWarpDexTickers, {
  responseWarpDexTickersItem,
} from './useGetWarpPools';

type DefaultPairPoolIdItem = {
  reverse: boolean;
};

type DefaultPairPoolIdObj = {
  [key: number]: DefaultPairPoolIdItem;
};

const defaultPairPoolId: DefaultPairPoolIdObj = {
  12: {
    reverse: true,
  },

  19: {
    reverse: true,
  },

  5: {
    reverse: false,
  },

  6: {
    reverse: false,
  },

  1: {
    reverse: false,
  },
};

function SwapAction() {
  const dataPoolsWarpDex = useWarpDexTickers();

  const dataRender = useMemo(() => {
    const selectedPools: Array<
      DefaultPairPoolIdItem & responseWarpDexTickersItem
    > = [];
    if (dataPoolsWarpDex) {
      dataPoolsWarpDex.forEach((item) => {
        if (
          Object.prototype.hasOwnProperty.call(defaultPairPoolId, item.pool_id)
        ) {
          const { reverse } = defaultPairPoolId[item.pool_id];
          selectedPools.push({ ...item, reverse });
        }
      });
    }
    return selectedPools;
  }, [dataPoolsWarpDex]);

  console.log('dataRender', dataRender);

  return (
    <div>
      Swap
      <br />
      <div
        style={{
          gap: '25px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          justifyItems: 'center',
        }}
      >
        {dataRender.map((item) => {
          // const [{ coinDecimals }] = traseDenom(item.target_currency);

          // const amountTokenA = getDisplayAmountReverce(1, coinDecimals);
          // const counterPairAmount = item.last_price * parseFloat(amountTokenA);
          const searchParam = item.reverse
            ? `from=${item.base_currency}&to=${item.target_currency}`
            : `from=${item.target_currency}&to=${item.base_currency}`;
          return (
            <Link
              to={`swap?${searchParam}`}
              key={item.ticker_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: item.reverse ? 'row' : 'row-reverse',
                }}
              >
                <DenomArr
                  denomValue={item.base_currency}
                  onlyText
                  tooltipStatusText={false}
                />
                -
                <DenomArr
                  denomValue={item.target_currency}
                  onlyText
                  tooltipStatusText={false}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: item.reverse ? 'row' : 'row-reverse',
                }}
              >
                {/* #{item.pool_id} {item.ticker_id} */}
                <DenomArr
                  denomValue={item.base_currency}
                  onlyImg
                  tooltipStatusImg={false}
                  size={30}
                />
                <img style={{ width: '25px' }} src={rectangle} alt="img" />
                <DenomArr
                  denomValue={item.target_currency}
                  onlyImg
                  tooltipStatusImg={false}
                  size={30}
                />
              </div>
              {/* <div>1 {counterPairAmount}</div> */}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SwapAction;
