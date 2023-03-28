import React, { useMemo, useEffect, useContext } from 'react';
import { Dots } from '../../../../components';
import { ContainerGradient } from '../../../portal/components';
import { useGetBalanceBostrom, useGetPassportByAddress } from '../../hooks';
import { SigmaContext } from '../../SigmaContext';
import { TitleCard, RowBalancesDetails } from '../cardUi';

function CardPassport({ accounts }) {
  const { updateDataCap } = useContext(SigmaContext);
  const { passport } = useGetPassportByAddress(accounts);
  const { totalAmountInLiquid, balances, totalAmountInLiquidOld } =
    useGetBalanceBostrom(accounts);
  // console.log('accounts', accounts)
  // SigmaCardPassport ({dataPassport})
  // get info address

  useEffect(() => {
    if (accounts !== null) {
      const { bech32 } = accounts;

      updateDataCap({ [bech32]: { ...totalAmountInLiquid } });
    }
  }, [totalAmountInLiquid, accounts]);

  const reduceDataBalanceTokenRow = useMemo(() => {
    let dataObj = {};
    if (Object.keys(balances).length > 0) {
      const sortable = Object.fromEntries(
        Object.entries(balances).sort(
          ([, a], [, b]) => b.cap.amount - a.cap.amount
        )
      );
      dataObj = sortable;
    }
    return dataObj;
  }, [balances]);

  const renderbalanceTokenRow = useMemo(() => {
    return Object.keys(reduceDataBalanceTokenRow).map((key) => {
      return <RowBalancesDetails balance={reduceDataBalanceTokenRow[key]} />;
    });
  }, [reduceDataBalanceTokenRow]);

  return (
    <ContainerGradient
      userStyleContent={{ height: 'auto' }}
      togglingDisable
      title={
        <TitleCard
          accounts={accounts}
          passport={passport}
          totalLiquid={
            totalAmountInLiquid.currentCap > 0
              ? totalAmountInLiquid
              : totalAmountInLiquidOld
          }
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* <RowBalancesDetails balance={balanceMainToken} /> */}

        {Object.keys(renderbalanceTokenRow).length > 0 ? (
          renderbalanceTokenRow
        ) : (
          <Dots />
        )}
        {/* <div>balance main token</div>

      <div>balance tokens </div> */}
      </div>
    </ContainerGradient>
  );
}

export default CardPassport;
