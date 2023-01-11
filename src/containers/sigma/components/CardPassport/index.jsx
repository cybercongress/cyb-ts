import React, { useMemo, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { CYBER } from '../../../../utils/config';
import { ContainerGradient } from '../../../portal/components';
import { useGetBalanceBostrom, useGetPassportByAddress } from '../../hooks';
import { SigmaContext } from '../../SigmaContext';
import { TitleCard, RowBalancesDetails } from '../cardUi';

const CardPassport = ({ accounts }) => {
  const { updateTotalCap, updateChangeCap } = useContext(SigmaContext);
  const { passport } = useGetPassportByAddress(accounts);
  const { totalAmountInLiquid, balanceMainToken, balanceToken } =
    useGetBalanceBostrom(accounts);
  // console.log('accounts', accounts)
  // SigmaCardPassport ({dataPassport})
  // get info address

  // console.log('passport', passport)

  useEffect(() => {
    console.log('totalAmountInLiquid', totalAmountInLiquid);

    if (totalAmountInLiquid.currentCap > 0) {
      updateTotalCap(totalAmountInLiquid.currentCap);
    }

    if (totalAmountInLiquid.change > 0) {
      updateChangeCap(totalAmountInLiquid.change);
    }
  }, [totalAmountInLiquid]);

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

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(CardPassport);
