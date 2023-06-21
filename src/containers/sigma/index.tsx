import { useEffect, useState, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';

import { MainContainer } from '../portal/components';
import { SigmaContext } from './SigmaContext';

import { CardPassport } from './components';
import { FormatNumberTokens } from '../nebula/components';
import { CYBER } from '../../utils/config';
import { formatNumber } from '../../utils/utils';
import { ActionBar, ContainerGradientText } from '../../components';
import { useParams } from 'react-router-dom';
import { useGetPassportByAddress } from './hooks';
import { useRobotContext } from 'src/pages/robot/Robot';
import { RootState } from 'src/redux/store';
import ActionBarPortalGift from '../portal/gift/ActionBarPortalGift';
import STEP_INFO from '../portal/gift/utils';
import styles from './Sigma.module.scss';

const valueContext = {
  totalCap: 0,
  changeCap: 0,
  dataCap: {},
};

function Sigma({ address: preAddr }) {
  // const [accountsData, setAccountsData] = useState([]);
  const [value, setValue] = useState(valueContext);

  // const { addressActive: accounts } = useSetActiveAddress(defaultAccount);
  const { address, isOwner } = useRobotContext();
  const [step, setStep] = useState(STEP_INFO.STATE_PROVE);
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const {
    pocket: { accounts, defaultAccount },
    passport: defaultPassport,
  } = useSelector((state: RootState) => {
    return {
      pocket: state.pocket,
      passport: state.passport,
    };
  });

  const currentAddress = address || preAddr;

  const { passport } = useGetPassportByAddress(currentAddress);

  const accountsData = [];

  if (address) {
    accountsData.push({
      bech32: address,
    });
  }

  // if (isO)
  // isOwner &&
  //   accounts &&
  // Object.keys(accounts).forEach((item) => {
  //   const { bech32 } = accounts[item]?.cyber || {};
  //   if (bech32 && !accountsData.find((item) => item.bech32 === bech32)) {
  //     accountsData.push({
  //       bech32,
  //     });
  //   }
  // });

  // console.log(address, preAddr, isOwner);

  const currentOwner =
    isOwner ||
    (defaultPassport.data && defaultPassport.data.owner === currentAddress);
  const currentPassport = currentOwner ? defaultPassport.data : passport;

  if (preAddr) {
    accountsData.push({
      bech32: preAddr,
    });
  }

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

  function selectAddress(address: string) {
    setSelectedAddress(address);
    setStep(STEP_INFO.STATE_DELETE_ADDRESS);
  }

  const renderItem = useMemo(() => {
    if (accountsData.length > 0) {
      return accountsData.map(({ bech32: address }) => {
        return (
          <CardPassport
            key={address}
            address={address}
            passport={currentPassport}
            selectAddress={selectAddress}
          />
        );
      });
    }

    return null;
  }, []);

  return (
    <SigmaContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ ...value, updateTotalCap, updateChangeCap, updateDataCap }}
    >
      <div
        style={{
          overflowX: 'auto',
        }}
      >
        <ContainerGradientText>
          <header className={styles.totalHeader}>
            <div className={styles.image}>
              <img src={require('../../image/temple/nebula.png')} />
              <h3>Sigma</h3>
            </div>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
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
          </header>
        </ContainerGradientText>

        {renderItem}
      </div>

      {selectedAddress && false ? (
        <ActionBar
          button={{
            text: 'Delete',
            onClick: () => {},
            disabled: true,
          }}
          // text={selectedAddress}
        />
      ) : passport ? (
        <ActionBarPortalGift
          setStepApp={setStep}
          activeStep={step}
          selectedAddress={selectedAddress}
          citizenship={passport}
          addressActive={{
            bech32: defaultAccount?.account?.cyber.bech32,
          }}
        />
      ) : null}
    </SigmaContext.Provider>
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
