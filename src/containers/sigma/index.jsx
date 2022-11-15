import React, { useEffect, useState } from 'react';
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

import { CardPassport } from './components';

function Sigma() {
  const [updateState, setUpdateState] = useState(0);
  const { accounts } = useGetLocalStoge(updateState);
  const { passport } = useGetPassportByAddress(accounts);

  // console.log('accounts', accounts)
  // console.log('passport', passport)

  // get local store

  // check passport

  // check or set active

  const updateStateFunc = () => {
    setUpdateState((item) => item + 1);
  };

  return (
    <>
      <MainContainer>
        <CardPassport accounts={accounts} />
      </MainContainer>
      <ActionBar updateFunc={updateStateFunc} />
    </>
  );
}

export default Sigma;

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
