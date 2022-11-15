import React, { useMemo } from 'react';
import { CYBER } from '../../../../utils/config';
import { useGetBalanceBostrom } from '../../hooks';
import { TitleCard, RowBalancesDetails } from '../cardUi';

const CardPassport = ({ passport, accounts }) => {
  const { totalAmountInLiquid, balanceMainToken, balanceToken } =
    useGetBalanceBostrom(accounts);
  // console.log('accounts', accounts)
  // SigmaCardPassport ({dataPassport})
  // get info address

  console.log('balanceToken', balanceToken);

  const renderbalanceTokenRow = useMemo(() => {
    return Object.keys(balanceToken).map((key) => {
      return <RowBalancesDetails balance={balanceToken[key]} />;
    });
  }, [balanceToken]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TitleCard />

      <RowBalancesDetails balance={balanceMainToken} />

      {renderbalanceTokenRow}
      {/* <div>balance main token</div>

      <div>balance tokens </div> */}
    </div>
  );
};

export default CardPassport;
