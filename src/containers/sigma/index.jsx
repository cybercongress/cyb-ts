import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  useGetLocalStoge,
  useGetPassportByAddress,
  useGetBalanceBostrom,
} from './hooks';
import {
  ActionBarSteps,
  BtnGrd,
  ActionBarContainer,
  MainContainer,
} from '../portal/components';
import ActionBar from './ActionBar';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';

import { CardPassport } from './components';

function Sigma({ defaultAccount }) {
  const [updateState, setUpdateState] = useState(0);
  const { addressActive: accounts } = useSetActiveAddress(defaultAccount);

  // const { accounts } = useGetLocalStoge(updateState);
  // const [accountsData, setAccountsData] = useState([]);
  // console.log('accounts', accounts)
  // console.log('passport', passport)

  // useEffect(() => {
  //   const pocketAccountLs = localStorage.getItem('pocketAccount');
  //   const localStoragePocket = localStorage.getItem('pocket');

  //   let accountsTemp = {};

  //   if (pocketAccountLs !== null && localStoragePocket !== null) {
  //     const pocketAccountData = JSON.parse(pocketAccountLs);
  //     const localStoragePocketData = JSON.parse(localStoragePocket);

  //     const keyPocket = Object.keys(localStoragePocketData)[0];
  //     accountsTemp = {
  //       [keyPocket]: pocketAccountData[keyPocket],
  //       ...pocketAccountData,
  //     };
  //   }

  //   if (pocketAccountLs !== null) {
  //     const data = [];
  //     if (Object.keys(accountsTemp).length > 0) {
  //       Object.keys(accountsTemp).forEach((key) => {
  //         const { cyber } = accountsTemp[key];
  //         if (cyber) {
  //           data.push({ ...cyber });
  //         }
  //       });
  //     }
  //     if (data.length > 0) {
  //       setAccountsData(data);
  //     }
  //   }
  // }, []);

  // get local store

  // check passport

  // check or set active

  const updateStateFunc = () => {
    setUpdateState((item) => item + 1);
  };

  // const renderItem = useMemo(() => {
  //   if (accountsData.length > 0) {
  //     return accountsData.map((item) => {
  //       return <CardPassport accounts={item} />;
  //     });
  //   }

  //   return null;
  // }, [accountsData]);

  return (
    <>
      {/* <MainContainer width="82%">{renderItem}</MainContainer> */}
      <MainContainer width="82%">
        <CardPassport accounts={accounts} />
      </MainContainer>
      {/* <ActionBar updateFunc={updateStateFunc} /> */}
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Sigma);

// базаво давать добавть адрес и все
// для того что бы доваить космос , эфир , аватар надо создать паспорт
// можно сделать урезанный функционал
// надо добвать иконку что бы создал паспорт, можно другим цветм подсветить

// save address
// {
//     "bech32": "bostrom16macu2qtc0jmqc7txvf0wkz84cycsx728ah0xc",
//     "keyWallet": "keplr",
//     "name": "ledger S"
// }

// pasport sigma
// {
//  bostrom16macu2qtc0jmqc7txvf0wkz84cycsx728ah0xc: {
//     null;
//   }
// }
