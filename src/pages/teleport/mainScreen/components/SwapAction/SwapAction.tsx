import { useMemo } from 'react';
import useWarpDexTickers from 'src/hooks/useGetWarpPools';
import Display from 'src/components/containerGradient/Display/Display';
import TitleAction from '../TitleAction/TitleAction';
import { DefaultPairPoolIdObj, SelectedPool } from '../../type';
import SwapItem from './SwapItem';
import styles from './SwapAction.module.scss';
import TotalCount from '../TotalCount/TotalCount';

const reverse = (value: boolean) => ({
  reverse: value,
});

const defaultPairPoolId: DefaultPairPoolIdObj = {
  12: reverse(true),

  19: reverse(true),

  5: reverse(false),

  6: reverse(false),

  1: reverse(false),
};

function SwapAction() {
  const { data: dataPoolsWarpDex } = useWarpDexTickers();

  const totalCount = useMemo(() => {
    if (dataPoolsWarpDex) {
      return dataPoolsWarpDex.length - Object.keys(defaultPairPoolId).length;
    }
    return 0;
  }, [dataPoolsWarpDex]);

  const dataRender = useMemo(() => {
    const selectedPools: Array<SelectedPool> = [];
    if (dataPoolsWarpDex) {
      dataPoolsWarpDex.forEach((item) => {
        if (defaultPairPoolId[item.pool_id]) {
          const { reverse } = defaultPairPoolId[item.pool_id];
          selectedPools.push({ ...item, reverse });
        }
      });
    }
    return selectedPools;
  }, [dataPoolsWarpDex]);

  const renderItems = dataRender.map((item) => {
    return <SwapItem item={item} key={item.pool_id} />;
  });

  return (
    <Display
      title={
        <TitleAction
          to="swap"
          title="swap"
          subTitle="truly free exchange with warp dex"
        />
      }
    >
      <div className={styles.container}>
        {renderItems}
        {totalCount > 0 && <TotalCount value={totalCount} to="swap" />}
      </div>
    </Display>
  );
}

export default SwapAction;
