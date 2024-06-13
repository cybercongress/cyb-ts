import { useEffect, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { useLocation } from 'react-router-dom';
import { useRobotContext } from 'src/pages/robot/robot.context';
import TokenChange from 'src/components/TokenChange/TokenChange';
import { routes } from 'src/routes';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import Display from 'src/components/containerGradient/Display/Display';
import { useAppSelector } from 'src/redux/hooks';
import { SigmaContext } from './SigmaContext';

import { CardPassport } from './components';
import ActionBarPortalGift from '../portal/gift/ActionBarPortalGift';
import STEP_INFO from '../portal/gift/utils';
import styles from './Sigma.module.scss';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { useAdviser } from 'src/features/adviser/context';

const valueContext = {
  totalCap: 0,
  changeCap: 0,
  dataCap: {},
};

function Sigma() {
  // const [accountsData, setAccountsData] = useState([]);
  const [value, setValue] = useState(valueContext);
  const location = useLocation();

  // const { addressActive: accounts } = useSetActiveAddress(defaultAccount);
  const { address, isOwner, passport } = useRobotContext();
  const [step, setStep] = useState(STEP_INFO.STATE_PROVE);
  const [selectedAddress, setSelectedAddress] = useState<string | null>();

  const {
    pocket: { accounts, defaultAccount },
  } = useAppSelector((state) => {
    return {
      pocket: state.pocket,
    };
  });

  const { passport: defaultPassport } = usePassportByAddress(
    defaultAccount?.account?.cyber?.bech32 || null
  );

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser('current neurons capital valuation');
  }, [setAdviser]);

  const superSigma = location.pathname === routes.sigma.path;

  const accountsData = useMemo(() => {
    if (!superSigma) {
      return [
        {
          bech32: address,
        },
      ];
    }

    return (
      accounts &&
      Object.values(accounts)
        .filter((account) => account?.cyber?.bech32)
        .map((account) => {
          return {
            bech32: account?.cyber?.bech32,
          };
        })
    );
  }, [address, accounts, superSigma]);

  const isCurrentOwner = isOwner || superSigma;
  const currentPassport = isCurrentOwner ? defaultPassport : passport;

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
      dataCap: superSigma ? { ...item.dataCap, ...newData } : { ...newData },
    }));
  };

  function selectAddress(address: string) {
    const isRemove = selectedAddress === address;

    setSelectedAddress(!isRemove ? address : null);
    setStep(!isRemove ? STEP_INFO.STATE_DELETE_ADDRESS : STEP_INFO.STATE_PROVE);
  }

  return (
    <SigmaContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...value,
        updateTotalCap,
        updateChangeCap,
        updateDataCap,
        isOwner: isCurrentOwner,
      }}
    >
      <div className={styles.wrapper}>
        <Display
          noPaddingX
          noPaddingY
          title={
            <DisplayTitle
              title={superSigma ? 'Supersigma' : 'Sigma'}
              image={<img src={require('../../image/sigma.png')} alt="sigma" />}
            >
              <TokenChange
                total={value.totalCap}
                // change={value.changeCap}
              />
            </DisplayTitle>
          }
        >
          {accountsData?.map(({ bech32: address }) => {
            return (
              <CardPassport
                key={address}
                address={address}
                passport={currentPassport}
                selectAddress={isCurrentOwner ? selectAddress : undefined}
                selectedAddress={selectedAddress}
              />
            );
          })}
        </Display>
      </div>

      {isCurrentOwner && currentPassport && (
        <ActionBarPortalGift
          setStepApp={(step) => {
            if (
              [STEP_INFO.STATE_INIT, STEP_INFO.STATE_PROVE_DONE].includes(step)
            ) {
              setSelectedAddress(null);
              setStep(STEP_INFO.STATE_PROVE);
            } else {
              setStep(step);
            }
          }}
          activeStep={step}
          selectedAddress={selectedAddress}
          citizenship={currentPassport}
          addressActive={{
            bech32: defaultAccount?.account?.cyber.bech32,
          }}
        />
      )}
    </SigmaContext.Provider>
  );
}

export default Sigma;
