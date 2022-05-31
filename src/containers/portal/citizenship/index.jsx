import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { calculateFee } from '@cosmjs/stargate';
import { coins, GasPrice } from '@cosmjs/launchpad';
import BigNumber from 'bignumber.js';
import {
  ContainerGradient,
  Signatures,
  ScrollableTabs,
  MainContainer,
} from '../components';
import {
  Welcome,
  Rules,
  InputNickname,
  Avatar,
  InitKeplr,
  SetupKeplr,
  ConnectKeplr,
  Passport,
} from '../stateComponent';
import ActionBar from './ActionBar';
import { getPin, getCredit } from '../../../utils/search/utils';
import { AvataImgIpfs } from '../components/avataIpfs';
import { AppContext } from '../../../context';
import { CONTRACT_ADDRESS, getPassportByNickname } from '../utils';
import { CYBER } from '../../../utils/config';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { steps } from './utils';
import Info from './Info';
import Carousel from '../gift/carousel1/Carousel';
// import InfoCard from '../components/infoCard/infoCard';

const {
  STEP_INIT,
  STEP_NICKNAME_CHOSE,
  STEP_NICKNAME_INVALID,
  STEP_NICKNAME_APROVE,
  STEP_RULES,
  STEP_AVATAR_UPLOAD,
  STEP_KEPLR_INIT,
  STEP_KEPLR_INIT_CHECK_FNC,
  STEP_KEPLR_SETUP,
  STEP_KEPLR_CONNECT,
  STEP_CHECK_ADDRESS,
  STEP_CHECK_ADDRESS_CHECK_FNC,
  STEP_ACTIVE_ADD,
  STEP_KEPLR_REGISTER,
  STEP_DONE,
  STEP_CHECK_GIFT,
} = steps;

// const items1 = {
//   [STEP_NICKNAME_CHOSE]: 'nickname',
//   [STEP_RULES]: 'rules',
//   [STEP_AVATAR_UPLOAD]: 'avatar',
//   [STEP_KEPLR_INIT]: 'install keplr',
//   [STEP_KEPLR_SETUP]: 'setup keplr',
//   [STEP_KEPLR_CONNECT]: 'connect keplr',
//   [STEP_CHECK_ADDRESS]: 'check address',
//   [STEP_KEPLR_REGISTER]: 'register',
//   [STEP_DONE]: 'passport look',
// };

const items = [
  {
    title: 'nickname',
    step: STEP_NICKNAME_CHOSE,
  },
  {
    title: 'rules',
    step: STEP_RULES,
  },
  {
    title: 'avatar',
    step: STEP_AVATAR_UPLOAD,
  },
  {
    title: 'install keplr',
    step: STEP_KEPLR_INIT,
  },
  {
    title: 'setup keplr',
    step: STEP_KEPLR_SETUP,
  },
  {
    title: 'connect keplr',
    step: STEP_KEPLR_CONNECT,
  },
  {
    title: 'passport',
    step: STEP_CHECK_ADDRESS,
  },
];

const gasPrice = GasPrice.fromString('0.001boot');

const calculatePriceNicname = (valueNickname) => {
  let funds = [];
  if (valueNickname.length < 8) {
    const exponent = 8 - valueNickname.length;
    const base = new BigNumber(10).pow(exponent);
    const priceName = new BigNumber(1000000).multipliedBy(base).toNumber();
    funds = coins(priceName, CYBER.DENOM_CYBER);
  }

  return funds;
};

function GetCitizenship({ node, defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [step, setStep] = useState(STEP_INIT);
  const [valueNickname, setValueNickname] = useState('');
  // const [validNickname, setValidNickname] = useState(true);
  const [avatarIpfs, setAvatarIpfs] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [registerDisabled, setRegisterDisabled] = useState(false);

  useEffect(() => {
    const localStorageNickname = localStorage.getItem('nickname');
    if (localStorageNickname !== null) {
      const localStorageNicknameData = JSON.parse(localStorageNickname);
      setValueNickname(localStorageNicknameData);

      const localStorageAvatarCid = localStorage.getItem('avatarCid');
      if (localStorageAvatarCid !== null) {
        const localStorageAvatarCidData = JSON.parse(localStorageAvatarCid);
        setAvatarIpfs(localStorageAvatarCidData);
        setStep(STEP_KEPLR_INIT_CHECK_FNC);
      } else {
        setStep(STEP_NICKNAME_CHOSE);
      }
    } else {
      setStep(STEP_INIT);
    }
  }, []);

  useEffect(() => {
    const getPinAvatar = async () => {
      if (node !== null && avatarImg !== null) {
        const toCid = await getPin(node, avatarImg);
        console.log('toCid', toCid);
        setAvatarIpfs(toCid);
      }
    };
    getPinAvatar();
  }, [node, avatarImg]);

  useEffect(() => {
    const getKeplr = async () => {
      if (step === STEP_KEPLR_INIT_CHECK_FNC) {
        if (window.keplr === undefined) {
          setStep(STEP_KEPLR_INIT_CHECK_FNC);
        } else {
          const offlineSigner = window.getOfflineSigner(CYBER.CHAIN_ID);
          try {
            await offlineSigner.getAccounts();
            setStep(STEP_KEPLR_CONNECT);
          } catch (error) {
            setStep(STEP_KEPLR_SETUP);
          }
        }
      }
    };
    getKeplr();
  }, [step]);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            localStorage.removeItem('nickname');
            localStorage.removeItem('avatarCid');
            setStep(STEP_CHECK_GIFT);

            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: response.rawLog.toString(),
            }));
            setStep(STEP_KEPLR_REGISTER);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const usePriceNickname = useMemo(() => {
    if (valueNickname.length < 8) {
      const priceNickname = calculatePriceNicname(valueNickname);
      if (priceNickname.length > 0) {
        const [{ amount: amountPrice, denom: denomPrice }] = priceNickname;

        return { amountPrice, denomPrice };
      }
    }
    return null;
  }, [valueNickname]);

  useEffect(() => {
    const checkAddress = async () => {
      if (
        step === STEP_CHECK_ADDRESS_CHECK_FNC &&
        jsCyber !== null &&
        addressActive !== null
      ) {
        const { bech32 } = addressActive;
        const response = await jsCyber.getAccount(bech32);
        await getBalanceAndNickname(bech32);
        if (
          response &&
          Object.prototype.hasOwnProperty.call(response, 'accountNumber')
        ) {
          setStep(STEP_KEPLR_REGISTER);
        } else {
          setStep(STEP_ACTIVE_ADD);
        }
      }
    };
    checkAddress();
  }, [jsCyber, addressActive, step]);

  const getBalanceAndNickname = useCallback(
    async (bech32) => {
      if (usePriceNickname !== null) {
        const { amountPrice } = usePriceNickname;
        if (jsCyber !== null) {
          const getBalance = await jsCyber.getBalance(
            bech32,
            CYBER.DENOM_CYBER
          );
          const { amount } = getBalance;
          if (parseFloat(amount) === 0) {
            setRegisterDisabled(false);
          } else if (parseFloat(amountPrice) > parseFloat(amount)) {
            setRegisterDisabled(false);
          } else {
            setRegisterDisabled(true);
          }
        }
      } else {
        setRegisterDisabled(true);
      }
    },
    [jsCyber, usePriceNickname]
  );

  const checkAddressNetwork = useCallback(async () => {
    if (
      step === STEP_ACTIVE_ADD &&
      jsCyber !== null &&
      addressActive !== null
    ) {
      const { bech32 } = addressActive;
      const response = await jsCyber.getAccount(bech32);
      console.log('response', response);
      if (
        response &&
        Object.prototype.hasOwnProperty.call(response, 'accountNumber')
      ) {
        setStep(STEP_KEPLR_REGISTER);
      } else {
        const responseCredit = await getCredit(bech32);
        if (responseCredit !== null && responseCredit.data === 'ok') {
          checkAddressNetwork();
        }
      }
    }
  }, [jsCyber, addressActive, step]);

  const checkNickname = useCallback(async () => {
    try {
      if (jsCyber !== null) {
        const responsData = await getPassportByNickname(jsCyber, valueNickname);
        if (responsData === null) {
          setStep(STEP_NICKNAME_APROVE);
        } else {
          setStep(STEP_NICKNAME_INVALID);
        }
      }
    } catch (error) {
      console.log('error', error);
      setStep(STEP_NICKNAME_INVALID);
    }
  }, [jsCyber, valueNickname]);

  const setupNickname = useCallback(() => {
    localStorage.setItem('nickname', JSON.stringify(valueNickname));
    setStep(STEP_RULES);
  }, [valueNickname]);

  const uploadAvatarImg = useCallback(() => {
    if (avatarIpfs !== null) {
      localStorage.setItem('avatarCid', JSON.stringify(avatarIpfs));
      setStep(STEP_KEPLR_INIT_CHECK_FNC);
    }
  }, [avatarIpfs]);

  const onClickRegister = useCallback(async () => {
    try {
      const [{ address }] = await keplr.signer.getAccounts();
      const msgObject = {
        create_passport: {
          avatar: avatarIpfs,
          nickname: valueNickname,
        },
      };
      const funds = calculatePriceNicname(valueNickname);
      console.log('funds', funds);
      const executeResponseResult = await keplr.execute(
        address,
        CONTRACT_ADDRESS,
        msgObject,
        calculateFee(500000, gasPrice),
        'cyber',
        funds
      );
      console.log('executeResponseResult', executeResponseResult);
      if (executeResponseResult.code === 0) {
        setTxHash({
          status: 'pending',
          txHash: executeResponseResult.transactionHash,
        });
        setStep(STEP_DONE);
      }

      if (executeResponseResult.code) {
        setTxHash({
          txHash: executeResponseResult?.transactionHash,
          status: 'error',
          rawLog: executeResponseResult?.rawLog.toString(),
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [valueNickname, avatarIpfs, keplr]);

  let content;

  if (step === STEP_INIT) {
    content = <Welcome />;
  }

  if (
    step === STEP_NICKNAME_CHOSE ||
    step === STEP_NICKNAME_APROVE ||
    step === STEP_NICKNAME_INVALID
  ) {
    content = (
      <InputNickname
        step={step}
        valueNickname={valueNickname}
        setValueNickname={setValueNickname}
      />
    );
  }

  if (step === STEP_RULES) {
    content = <Rules />;
  }

  if (step === STEP_AVATAR_UPLOAD) {
    content = (
      <Avatar
        valueNickname={valueNickname}
        upload={avatarIpfs === null}
        setAvatarImg={setAvatarImg}
        avatar={
          avatarIpfs === null ? (
            'upload avatar'
          ) : (
            <AvataImgIpfs cidAvatar={avatarIpfs} node={node} />
          )
        }
      />
    );
  }

  if (step === STEP_KEPLR_INIT || step === STEP_KEPLR_INIT_CHECK_FNC) {
    content = <InitKeplr />;
  }

  if (step === STEP_KEPLR_SETUP) {
    content = <SetupKeplr />;
  }

  if (step === STEP_KEPLR_CONNECT) {
    content = <ConnectKeplr />;
  }

  if (
    step === STEP_CHECK_ADDRESS ||
    step === STEP_CHECK_ADDRESS_CHECK_FNC ||
    step === STEP_ACTIVE_ADD ||
    step === STEP_KEPLR_REGISTER
  ) {
    content = (
      <Passport
        valueNickname={valueNickname}
        txs={txHash}
        avatar={<AvataImgIpfs cidAvatar={avatarIpfs} node={node} />}
        addressActive={addressActive}
      />
    );
  }

  if (step === STEP_DONE || step === STEP_CHECK_GIFT) {
    content = (
      <Passport
        valueNickname={valueNickname}
        avatar={<AvataImgIpfs cidAvatar={avatarIpfs} node={node} />}
        txs={txHash}
        addressActive={addressActive}
      />
    );
  }

  const useDisableNext = useMemo(() => {
    return true;
  }, []);

  return (
    <>
      <MainContainer>
        <Info
          nickname={valueNickname}
          stepCurrent={step}
          valuePriceNickname={usePriceNickname}
          registerDisabled={registerDisabled}
          setStep={setStep}
        />
        {step !== STEP_INIT && step !== STEP_CHECK_GIFT && (
          <Carousel
            slides={items}
            activeStep={Math.floor(step)}
            setStep={setStep}
            disableNext={useDisableNext}
          />
        )}
        {/* {step !== STEP_INIT && step !== STEP_CHECK_GIFT && (
            <ScrollableTabs items={items} active={step} setStep={setStep} />
          )} */}
        {content}

        {/* <button type="button" onClick={() => checkKeplr()}>
          keplr
        </button> */}
      </MainContainer>

      <ActionBar
        keplr={keplr}
        step={step}
        setStep={setStep}
        setupNickname={setupNickname}
        checkNickname={checkNickname}
        uploadAvatarImg={uploadAvatarImg}
        avatarImg={avatarImg}
        setAvatarImg={setAvatarImg}
        avatarIpfs={avatarIpfs}
        onClickRegister={onClickRegister}
        checkAddressNetwork={checkAddressNetwork}
        registerDisabled={registerDisabled}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(GetCitizenship);
