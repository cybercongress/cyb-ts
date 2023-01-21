import React, { useMemo, useEffect, useContext } from 'react';
import { Dots } from '../../../../components';
import { AppContext } from '../../../../context';
import { CYBER } from '../../../../utils/config';
import { ContainerGradient } from '../../../portal/components';
import { useGetBalanceBostrom, useGetPassportByAddress } from '../../hooks';
import { SigmaContext } from '../../SigmaContext';
import { TitleCard, RowBalancesDetails } from '../cardUi';

const CardPassport = ({ accounts }) => {
  const { updateTotalCap, updateChangeCap } = useContext(SigmaContext);
  const { passport } = useGetPassportByAddress(accounts);
  const { totalAmountInLiquid, balances, totalAmountInLiquidOld } =
    useGetBalanceBostrom(accounts);
  // console.log('accounts', accounts)
  // SigmaCardPassport ({dataPassport})
  // get info address

  useEffect(() => {
    console.log('totalAmountInLiquid', totalAmountInLiquid);

    if (totalAmountInLiquid.currentCap > 0) {
      updateTotalCap(totalAmountInLiquid.currentCap);
    }

    if (totalAmountInLiquid.change > 0) {
      updateChangeCap(totalAmountInLiquid.change);
    }
  }, [totalAmountInLiquid]);

  // const reduceDataBalanceTokenRow = useMemo(() => {
  //   let dataObj = {};
  //   if (Object.keys(balances).length > 0) {
  //     const sortable = Object.fromEntries(
  //       Object.entries(balances).sort(
  //         ([, a], [, b]) => b.cap.amount - a.cap.amount
  //       )
  //     );
  //     dataObj = sortable;
  //   }
  //   return dataObj;
  // }, [balances]);

  const renderbalanceTokenRow = useMemo(() => {
    return Object.keys(balances).map((key) => {
      return <RowBalancesDetails balance={balances[key]} />;
    });
  }, [balances]);

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
};

export default CardPassport;
