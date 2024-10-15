import { useEnergy } from 'src/pages/Energy/context/Energy.context';
import {
  getOsmoAssetByDenom,
  symbolToOsmoDenom,
} from 'src/pages/Energy/utils/utils';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useEffect, useMemo } from 'react';
import { StatusOrder } from 'src/pages/Energy/redux/utils';
import { setStatusOrder } from 'src/pages/Energy/redux/energy.redux';
import ActionBarContainer from './ActionBar';
import StatusIbc from './components/StatusIbc/StatusIbc';

function BuyPackages() {
  const { balances, energyPackageSwapRoutes } = useEnergy();
  const { selectPlan, tokenSell, ibcResult, swapResult, statusOrder } =
    useAppSelector((state) => state.energy);
  const dispatch = useAppDispatch();

  const balancesTokenSell = useMemo(() => {
    const denom = symbolToOsmoDenom(tokenSell);
    if (!denom) {
      return undefined;
    }
    return balances.hash[denom];
  }, [balances.hash, tokenSell]);

  useEffect(() => {
    if (statusOrder !== StatusOrder.SELECT_PACK || !selectPlan) {
      return;
    }

    if (
      balancesTokenSell &&
      parseFloat(balancesTokenSell.amount) > 0 &&
      parseFloat(balancesTokenSell.amount) >
        parseFloat(selectPlan.tokenIn.amount)
    ) {
      dispatch(setStatusOrder(StatusOrder.SWAP));
    }
  }, [balancesTokenSell, dispatch, selectPlan, statusOrder]);

  console.log('balancesTokenSell', balancesTokenSell);

  console.log('energyPackagesByDenom', selectPlan);

  const selectPackage = energyPackageSwapRoutes?.find(
    (item) => item.keyPackage === selectPlan?.keyPackage
  );

  console.log('ibcResult', ibcResult);

  return (
    <>
      <div>
        <div>statusOrder: {statusOrder}</div>

        <br />

        <div>keyPackage: {selectPlan?.keyPackage}$</div>
        <div>tokenSell: {tokenSell}</div>
        <div>tokenIn: {JSON.stringify(selectPlan?.tokenIn)}</div>

        {/* <div>{JSON.stringify(balancesTokenSell)}</div> */}

        <br />
        {selectPackage && !swapResult && (
          <div key={selectPackage.keyPackage}>
            <div>
              {selectPackage.tokenIn.amount} {selectPackage.tokenIn.denom}
            </div>
            <div>
              {selectPackage.swapInfo.map((itemInfo) => {
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
          </div>
        )}

        <div>
          {swapResult?.tokens.map((item) => {
            return (
              <div key={item.denom}>
                <div>
                  {item.amount}
                  {getOsmoAssetByDenom(item.denom)?.symbol || ''}
                </div>
              </div>
            );
          })}
        </div>

        <br />

        {ibcResult && (
          <>
            StatusIbc: <StatusIbc />
          </>
        )}
      </div>
      <ActionBarContainer />
    </>
  );
}

export default BuyPackages;
