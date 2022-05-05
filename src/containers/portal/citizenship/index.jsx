import React, { useEffect, useState, useCallback, useContext } from 'react';
import { connect } from 'react-redux';
import { calculateFee } from '@cosmjs/stargate';
import { coins, GasPrice } from '@cosmjs/launchpad';
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
import { CONTRACT_ADDRESS } from '../utils';
import { CYBER } from '../../../utils/config';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { steps } from './utils';
import Info from './Info';
// import InfoCard from '../components/infoCard/infoCard';

const {
  STEP_INIT,
  STEP_NICKNAME,
  STEP_RULES,
  STEP_AVATAR_UPLOAD,
  STEP_KEPLR_INIT,
  STEP_KEPLR_SETUP,
  STEP_KEPLR_CONNECT,
  STEP_CHECK_ADDRESS,
  STEP_KEPLR_REGISTER,
  STEP_DONE,
  STEP_CHECK_GIFT,
} = steps;

const items = {
  [STEP_NICKNAME]: 'nickname',
  [STEP_RULES]: 'rules',
  [STEP_AVATAR_UPLOAD]: 'avatar',
  [STEP_KEPLR_INIT]: 'install keplr',
  [STEP_KEPLR_SETUP]: 'setup keplr',
  [STEP_KEPLR_CONNECT]: 'connect keplr',
  [STEP_CHECK_ADDRESS]: 'check address',
  [STEP_KEPLR_REGISTER]: 'register',
  [STEP_DONE]: 'passport look',
};

const gasPrice = GasPrice.fromString('0.001boot');

function GetCitizenship({ node, defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [step, setStep] = useState(STEP_INIT);
  const [valueNickname, setValueNickname] = useState('');
  const [avatarIpfs, setAvatarIpfs] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    const localStorageNickname = localStorage.getItem('nickname');
    if (localStorageNickname !== null) {
      const localStorageNicknameData = JSON.parse(localStorageNickname);
      setValueNickname(localStorageNicknameData);

      const localStorageAvatarCid = localStorage.getItem('avatarCid');
      if (localStorageAvatarCid !== null) {
        const localStorageAvatarCidData = JSON.parse(localStorageAvatarCid);
        setAvatarIpfs(localStorageAvatarCidData);
        setStep(STEP_KEPLR_INIT);
      } else {
        setStep(STEP_NICKNAME);
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
      if (step === STEP_KEPLR_INIT) {
        if (window.keplr === undefined) {
          setStep(STEP_KEPLR_INIT);
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
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  // useEffect(() => {
  //   const checkAddress = async () => {
  //     if (
  //       step === STEP_CHECK_ADDRESS &&
  //       jsCyber !== null &&
  //       addressActive !== null
  //     ) {
  //       const { bech32 } = addressActive;
  //       const response = await jsCyber.getAccount(bech32);
  //       console.log('response', response);
  //       if (
  //         response &&
  //         Object.prototype.hasOwnProperty.call(response, 'accountNumber')
  //       ) {
  //         setStep(STEP_KEPLR_REGISTER);
  //       } else {
  //         const responseCredit = await getCredit(bech32);
  //         if (responseCredit !== null && responseCredit.data === 'ok') {
  //           checkAddress();
  //         }
  //       }
  //     }
  //   };
  //   checkAddress();
  // }, [jsCyber, addressActive, step]);

  const checkAddressNetwork = useCallback(async () => {
    if (
      step === STEP_CHECK_ADDRESS &&
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

  const setupNickname = useCallback(() => {
    localStorage.setItem('nickname', JSON.stringify(valueNickname));
    setStep(STEP_RULES);
  }, [valueNickname]);

  const uploadAvatarImg = useCallback(() => {
    if (avatarIpfs !== null) {
      localStorage.setItem('avatarCid', JSON.stringify(avatarIpfs));
      setStep(STEP_KEPLR_INIT);
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
      const funds = [];
      // if (valueNickname.length < 8) {
      //   const priceName = 1000000 * 10 * (8 - valueNickname.length);
      //   funds = coins(priceName, CYBER.DENOM_CYBER);
      // }
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

  if (step === STEP_NICKNAME) {
    content = (
      <InputNickname
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

  if (step === STEP_KEPLR_INIT) {
    content = <InitKeplr />;
  }

  if (step === STEP_KEPLR_SETUP) {
    content = <SetupKeplr />;
  }

  if (step === STEP_KEPLR_CONNECT) {
    content = <ConnectKeplr />;
  }

  if (step === STEP_KEPLR_REGISTER || step === STEP_CHECK_ADDRESS) {
    content = (
      <Passport
        valueNickname={valueNickname}
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

  console.log('step', step);
  return (
    <>
      <MainContainer>
        <Info nickname={valueNickname} stepCurrent={step} />
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
        uploadAvatarImg={uploadAvatarImg}
        avatarImg={avatarImg}
        setAvatarImg={setAvatarImg}
        avatarIpfs={avatarIpfs}
        onClickRegister={onClickRegister}
        checkAddressNetwork={checkAddressNetwork}
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
