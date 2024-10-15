import { Button } from 'src/components';
import { useEnergy } from 'src/pages/Energy/context/Energy.context';
import { getOsmoAssetByDenom } from 'src/pages/Energy/utils/utils';
import { assetsBuy } from 'src/pages/Energy/utils/tokenBuy';
import { setSelectPlan } from 'src/pages/Energy/redux/energy.redux';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useCallback } from 'react';
import { EnergyPackageSwapRoutes } from 'src/pages/Energy/types/EnergyPackages';
import BuyPackages from '../BuyPackages/BuyPackages';

console.log('assetsBuy', assetsBuy);

// const selectPackageKey = '10';

function EnergyMain() {
  const { energyPackageSwapRoutes } = useEnergy();
  const { selectPlan } = useAppSelector((state) => state.energy);
  const dispatch = useAppDispatch();

  console.log('selectPlan', selectPlan);

  // const balancesAssets = assetsBuy.reduce((acc: Coin[], item) => {
  //   if (balances.hash[item.base]) {
  //     acc.push(balances.hash[item.base]);
  //   }

  //   return acc;
  // }, []);

  // console.log('balances', balancesAssets);

  // console.log('energyPackageSwapRoutes', energyPackageSwapRoutes);

  const onClickSelectPlan = useCallback(
    (item: EnergyPackageSwapRoutes) => {
      dispatch(
        setSelectPlan({
          keyPackage: item.keyPackage,
          tokenIn: item.tokenIn,
        })
      );
    },
    [dispatch]
  );

  if (selectPlan) {
    return <BuyPackages />;
  }

  return (
    <div>
      {energyPackageSwapRoutes &&
        energyPackageSwapRoutes.map((item) => {
          return (
            <div key={item.keyPackage}>
              <div>{item.keyPackage}$</div>
              <div>
                {item.swapInfo.map((itemInfo) => {
                  return (
                    <div key={itemInfo.swap.tokenOut.denom}>
                      <div>{itemInfo.swap.tokenOut.amount}</div>
                      <div>
                        {getOsmoAssetByDenom(itemInfo.swap.tokenOut.denom)
                          ?.symbol || ''}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button text="energy" onClick={() => onClickSelectPlan(item)} />
            </div>
          );
        })}
    </div>
  );
}

export default EnergyMain;
