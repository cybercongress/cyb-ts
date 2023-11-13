import { useMemo } from 'react';
import { isNative } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import rectangle from 'images/rectangle.svg';
import { DenomArr } from 'src/components';
import { Link } from 'react-router-dom';
import useWarpDexTickers, {
  responseWarpDexTickersItem,
} from 'src/hooks/useGetWarpPools';
import BigNumber from 'bignumber.js';
import Display from 'src/components/containerGradient/Display/Display';
import { AmountDenom } from 'src/containers/txs/Activites';
import TitleAction from './components/TitleAction/TitleAction';

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
  const { data: dataPoolsWarpDex } = useWarpDexTickers();

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

  const renderItems = dataRender.map((item) => {
    const searchParam = item.reverse
      ? `from=${item.target_currency}&to=${item.base_currency}`
      : `from=${item.base_currency}&to=${item.target_currency}`;
    return (
      <Link
        to={`swap?${searchParam}`}
        key={item.ticker_id}
        style={{
          height: '100%',
          display: 'grid',
        }}
      >
        <div style={{ display: 'grid', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: item.reverse ? 'row-reverse' : 'row',
              }}
            >
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
            <div
              style={{
                display: 'flex',
                flexDirection: item.reverse ? 'row-reverse' : 'row',
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
          </div>
        </div>
      </Link>
    );
  });

  return (
    <Display
      title={
        <TitleAction
          title="swap"
          subTitle="truly free exchange with warp dex"
        />
      }
    >
      <div
        style={{
          gap: '25px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {renderItems}
      </div>
    </Display>
  );
}

export default SwapAction;
