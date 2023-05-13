import { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';

import { MainContainer } from '../portal/components';
import { SigmaContext } from './SigmaContext';

import { CardPassport } from './components';
import { FormatNumberTokens } from '../nebula/components';
import { CYBER } from '../../utils/config';
import { formatNumber } from '../../utils/utils';
import { ContainerGradientText } from '../../components';

const valueContext = {
  totalCap: 0,
  changeCap: 0,
  dataCap: {},
};

function Sigma({ defaultAccount }) {
  const [accountsData, setAccountsData] = useState([]);
  const [value, setValue] = useState(valueContext);
  // const { addressActive: accounts } = useSetActiveAddress(defaultAccount);

  // const { accounts } = useGetLocalStoge(updateState);

  useEffect(() => {
    const pocketAccountLs = localStorage.getItem('pocketAccount');
    const localStoragePocket = localStorage.getItem('pocket');

    let accountsTemp = {};

    if (pocketAccountLs !== null && localStoragePocket !== null) {
      const pocketAccountData = JSON.parse(pocketAccountLs);
      const localStoragePocketData = JSON.parse(localStoragePocket);

      const keyPocket = Object.keys(localStoragePocketData)[0];
      accountsTemp = {
        [keyPocket]: pocketAccountData[keyPocket],
        ...pocketAccountData,
      };
    }

    if (pocketAccountLs !== null) {
      const data = [];
      if (Object.keys(accountsTemp).length > 0) {
        Object.keys(accountsTemp).forEach((key) => {
          const { cyber } = accountsTemp[key];
          if (cyber) {
            data.push({ ...cyber });
          }
        });
      }
      if (data.length > 0) {
        setAccountsData(data);
      }
    }
  }, [defaultAccount]);

  useEffect(() => {
    const { dataCap } = value;
    if (Object.keys(dataCap).length > 0) {
      let changeCap = new BigNumber(0);
      let tempCap = new BigNumber(0);
      Object.values(dataCap).forEach((item) => {
        changeCap = changeCap.plus(item.change);
        tempCap = tempCap.plus(item.currentCap);
      });
      updateChangeCap(changeCap);
      updateTotalCap(tempCap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.dataCap]);

  // get local store

  // check passport

  // check or set active

  const updateTotalCap = (cap) => {
    setValue((item) => ({
      ...item,
      totalCap: new BigNumber(cap).dp(0, BigNumber.ROUND_FLOOR).toNumber(),
    }));
  };

  const updateChangeCap = (cap) => {
    setValue((item) => ({
      ...item,
      changeCap: new BigNumber(cap).dp(0, BigNumber.ROUND_FLOOR).toNumber(),
    }));
  };

  const updateDataCap = (newData) => {
    setValue((item) => ({
      ...item,
      dataCap: { ...item.dataCap, ...newData },
    }));
  };

  const renderItem = useMemo(() => {
    if (accountsData.length > 0) {
      return accountsData.map((item) => {
        const key = uuidv4();

        return <CardPassport key={`${item.bech32}_${key}`} accounts={item} />;
      });
    }

    return null;
  }, [accountsData]);

  return (
    <SigmaContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ ...value, updateTotalCap, updateChangeCap, updateDataCap }}
    >
      <MainContainer width="100%">
        <div>
          <ContainerGradientText>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '16px',
              }}
            >
              <div>Total</div>
              <div
                style={{ display: 'flex', gap: '30px', alignItems: 'center' }}
              >
                {value.changeCap > 0 && (
                  <div
                    style={{
                      color: value.changeCap > 0 ? '#7AFAA1' : '#FF0000',
                    }}
                  >
                    {value.changeCap > 0 ? '+' : ''}
                    {formatNumber(value.changeCap)}
                  </div>
                )}
                <FormatNumberTokens
                  // styleValue={{ fontSize: '18px' }}
                  text={CYBER.DENOM_LIQUID_TOKEN}
                  value={value.totalCap}
                />
              </div>
            </div>
          </ContainerGradientText>
        </div>

        {renderItem}
      </MainContainer>
      {/* <MainContainer width="82%">
        <CardPassport accounts={accounts} />
      </MainContainer> */}
      {/* <ActionBar updateFunc={updateStateFunc} /> */}
    </SigmaContext.Provider>
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
