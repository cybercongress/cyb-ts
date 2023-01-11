import React, { useMemo, useEffect } from 'react';
import { CYBER } from '../../../../utils/config';
import { ContainerGradient } from '../../../portal/components';
import { useGetBalanceBostrom, useGetPassportByAddress } from '../../hooks';
import { TitleCard, RowBalancesDetails } from '../cardUi';

const CardPassport = ({ accounts }) => {
  const { passport } = useGetPassportByAddress(accounts);
  const { totalAmountInLiquid, balanceMainToken, balanceToken } =
    useGetBalanceBostrom(accounts);
  // console.log('accounts', accounts)
  // SigmaCardPassport ({dataPassport})
  // get info address

  // console.log('passport', passport)

  // useEffect(() => {
  //   console.log('totalAmountInLiquid', totalAmountInLiquid);
  // }, [totalAmountInLiquid]);

  const renderbalanceTokenRow = useMemo(() => {
    return Object.keys(balanceToken).map((key) => {
      return <RowBalancesDetails balance={balanceToken[key]} />;
    });
  }, [balanceToken]);

  return (
    <ContainerGradient
      userStyleContent={{ height: 'auto' }}
      togglingDisable
      title={
        <TitleCard
          accounts={accounts}
          passport={passport}
          totalLiquid={totalAmountInLiquid}
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <RowBalancesDetails balance={balanceMainToken} />

        {renderbalanceTokenRow}
        {/* <div>balance main token</div>

      <div>balance tokens </div> */}
      </div>
    </ContainerGradient>
  );
};

export default CardPassport;
