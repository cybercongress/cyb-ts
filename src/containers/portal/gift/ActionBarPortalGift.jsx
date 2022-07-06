/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
  Pane,
} from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import { calculateFee } from '@cosmjs/stargate';
import { coins, GasPrice } from '@cosmjs/launchpad';
import { connect } from 'react-redux';
import { toAscii, fromBase64, toBase64 } from '@cosmjs/encoding';
import { setDefaultAccount, setAccounts } from '../../../redux/actions/pocket';
import { ActionBarContentText, Dots, ButtonIcon } from '../../../components';
import { CYBER, LEDGER, PATTERN_CYBER } from '../../../utils/config';
import { trimString, dhm, timeSince, groupMsg } from '../../../utils/utils';
import { AppContext } from '../../../context';
import {
  CONSTITUTION_HASH,
  CONTRACT_ADDRESS_PASSPORT,
  CONTRACT_ADDRESS_GIFT,
  BOOT_ICON,
} from '../utils';
import configTerraKeplr from './configTerraKeplr';
import { ActionBarSteps, BtnGrd } from '../components';
import { STEP_INFO } from './utils';

const dateFormat = require('dateformat');

const imgKeplr = require('../../../image/keplr-icon.svg');
const imgMetaMask = require('../../../image/mm-logo.svg');
const imgEth = require('../../../image/Ethereum_logo_2014.svg');
const imgBostrom = require('../../../image/large-green.png');
const imgOsmosis = require('../../../image/osmosis.svg');
const imgTerra = require('../../../image/terra.svg');
const imgCosmos = require('../../../image/cosmos-2.svg');

const gasPrice = GasPrice.fromString('0.001boot');

const STEP_INIT = 0;
const STEP_CONNECT = 1;
const STEP_SIGN = 2;
const STEP_CHECK_ACCOUNT = 2.1;
const STEP_CHANGE_ACCOUNT = 2.2;
const STEP_SEND_SIGN = 3;

const STEP_GIFT_INFO = 1;
const STEP_PROVE_ADD = 2;
const STEP_CLAIME = 3;

export const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === 'complete') {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

const proofAddressMsg = (address, nickname, signature) => {
  return {
    proof_address: {
      address,
      nickname,
      signature,
    },
  };
};

const deleteAddressMsg = (address, nickname) => {
  return {
    remove_address: {
      address,
      nickname,
    },
  };
};

const claimMsg = (nickname, giftClaimingAddress, giftAmount, proof) => {
  return {
    claim: {
      proof,
      gift_amount: giftAmount.toString(),
      gift_claiming_address: giftClaimingAddress,
      nickname,
    },
  };
};

function ActionBarPortalGift({
  addressActive,
  citizenship,
  updateTxHash,
  isClaimed,
  selectedAddress,
  currentGift,
  activeStep,
  setStepApp,
  setLoading,
  setLoadingGift,
  loadingGift,
}) {
  const history = useHistory();
  const { keplr, jsCyber, initSigner } = useContext(AppContext);
  const [selectMethod, setSelectMethod] = useState('');
  const [selectNetwork, setSelectNetwork] = useState('');
  const [signedMessageKeplr, setSignedMessageKeplr] = useState(null);

  useEffect(() => {
    const checkAddress = async () => {
      if (
        activeStep === STEP_INFO.STATE_PROVE_CHANGE_ACCOUNT ||
        activeStep === STEP_INFO.STATE_PROVE_CHECK_ACCOUNT
      ) {
        console.log('keplr', keplr);
        console.log('addressActive', addressActive);
        if (keplr !== null && addressActive !== null) {
          const [{ address }] = await keplr.signer.getAccounts();
          const { bech32 } = addressActive;
          if (address === bech32) {
            setStepApp(STEP_INFO.STATE_PROVE_SEND_SIGN);
          } else {
            setStepApp(STEP_INFO.STATE_PROVE_CHANGE_ACCOUNT);
          }
        }
      }
    };
    checkAddress();
  }, [keplr, addressActive, selectMethod, activeStep]);

  const useAddressOwner = useMemo(() => {
    if (citizenship !== null && addressActive !== null) {
      const { owner } = citizenship;
      const { name } = addressActive;
      if (name !== undefined && name !== null) {
        return (
          <>
            account
            <span style={{ color: '#36d6ae', padding: '0 5px' }}>{name}</span>
          </>
        );
      }
      return (
        <>
          address
          <span style={{ color: '#36d6ae', padding: '0 5px' }}>
            {trimString(owner, 10, 4)}
          </span>
        </>
      );
    }
    return '';
  }, [citizenship, addressActive]);

  const signMsgKeplr = useCallback(async () => {
    const keplrWindow = await getKeplr();
    if (keplrWindow && citizenship !== null && selectNetwork !== '') {
      const { owner } = citizenship;

      if (selectNetwork === 'columbus-5') {
        if (window.keplr.experimentalSuggestChain) {
          await window.keplr.experimentalSuggestChain(configTerraKeplr());
        }
      }
      await keplrWindow.enable(selectNetwork);
      const signer = await keplrWindow.getOfflineSignerAuto(selectNetwork);

      const [{ address }] = await signer.getAccounts();
      const data = `${owner}:${CONSTITUTION_HASH}`;
      const res = await keplrWindow.signArbitrary(selectNetwork, address, data);

      const proveData = {
        pub_key: res.pub_key.value,
        signature: res.signature,
      };

      const signature = toBase64(toAscii(JSON.stringify(proveData)));
      setSignedMessageKeplr({ signature, address });
      setStepApp(STEP_INFO.STATE_PROVE_CHECK_ACCOUNT);
    }
    return null;
  }, [citizenship, selectNetwork]);

  const signMsgETH = useCallback(async () => {
    if (window.ethereum && citizenship !== null) {
      const { owner } = citizenship;
      const { ethereum } = window;
      console.log('ethereum.isConnected()', ethereum.isConnected());

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      const message = `${owner}:${CONSTITUTION_HASH}`;
      const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      const from = address;

      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'proveAddress'],
      });

      console.log('first', {
        address,
        message,
        messageHash: msg,
        signature,
      });

      setSignedMessageKeplr({ signature, address });
      setStepApp(STEP_INFO.STATE_PROVE_CHECK_ACCOUNT);
    }
    return null;
  }, [citizenship]);

  const sendSignedMessage = useCallback(async () => {
    if (keplr !== null && citizenship !== null && signedMessageKeplr !== null) {
      const { nickname } = citizenship.extension;

      const msgObject = proofAddressMsg(
        signedMessageKeplr.address,
        nickname,
        signedMessageKeplr.signature
      );

      try {
        const [{ address }] = await keplr.signer.getAccounts();
        const executeResponseResult = await keplr.execute(
          address,
          CONTRACT_ADDRESS_PASSPORT,
          msgObject,
          calculateFee(400000, gasPrice),
          'cyber'
        );
        console.log('executeResponseResult', executeResponseResult);
        if (executeResponseResult.code === 0) {
          updateTxHash({
            status: 'pending',
            txHash: executeResponseResult.transactionHash,
          });
          setStepApp(STEP_INFO.STATE_PROVE_IN_PROCESS);
          if (setLoading) {
            setLoading(true);
          }
          if (setLoadingGift) {
            setLoadingGift(true);
          }
        }

        if (executeResponseResult.code) {
          updateTxHash({
            txHash: executeResponseResult?.transactionHash,
            status: 'error',
            rawLog: executeResponseResult?.rawLog.toString(),
          });
        }
      } catch (error) {
        console.log('error', error);
        setStepApp(STEP_INFO.STATE_PROVE);
      }
    }
  }, [keplr, citizenship, signedMessageKeplr, setLoading]);

  const useClaime = useCallback(async () => {
    try {
      if (keplr === null) {
        if (initSigner) {
          initSigner();
        }
      }

      if (
        keplr !== null &&
        selectedAddress !== null &&
        currentGift !== null &&
        citizenship !== null
      ) {
        const { nickname } = citizenship.extension;
        if (Object.keys(currentGift).length > 0) {
          const msgs = [];
          Object.keys(currentGift).forEach((key) => {
            const { address, proof, amount } = currentGift[key];
            const msgObject = claimMsg(nickname, address, amount, proof);
            msgs.push(msgObject);
          });
          const gasLimits = 500000 * Object.keys(currentGift).length;
          const { isNanoLedger, bech32Address } =
            await keplr.signer.keplr.getKey(CYBER.CHAIN_ID);
          if (msgs.length > 0) {
            let executeResponseResult;
            if (isNanoLedger && msgs.length > 1) {
              const groupMsgData = groupMsg(msgs, 1);
              const elementMsg = groupMsgData[0];
              executeResponseResult = await keplr.executeArray(
                bech32Address,
                CONTRACT_ADDRESS_GIFT,
                elementMsg,
                calculateFee(gasLimits, gasPrice),
                'cyber'
              );
            } else {
              executeResponseResult = await keplr.executeArray(
                bech32Address,
                CONTRACT_ADDRESS_GIFT,
                msgs,
                calculateFee(gasLimits, gasPrice),
                'cyber'
              );
            }

            console.log('executeResponseResult', executeResponseResult);
            if (executeResponseResult.code === 0) {
              updateTxHash({
                status: 'pending',
                txHash: executeResponseResult.transactionHash,
              });
              // setStep(STEP_INIT);
              if (setLoadingGift) {
                setLoadingGift(true);
              }
              setStepApp(STEP_INFO.STATE_CLAIM_IN_PROCESS);
            }

            if (executeResponseResult.code) {
              updateTxHash({
                txHash: executeResponseResult?.transactionHash,
                status: 'error',
                rawLog: executeResponseResult?.rawLog.toString(),
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      // setStep(STEP_INIT);
      setStepApp(STEP_INFO.STATE_CLAIME);
    }
  }, [keplr, selectedAddress, currentGift, citizenship, initSigner]);

  const isProve = useMemo(() => {
    if (citizenship !== null && citizenship.extension.addresses === null) {
      return false;
    }
    const validObj =
      citizenship !== null && citizenship.extension.addresses !== null;
    if (validObj && Object.keys(citizenship.extension.addresses).length <= 8) {
      return false;
    }

    return true;
  }, [citizenship]);

  const isClaime = useMemo(() => {
    if (isClaimed !== undefined && isClaimed !== null && !isClaimed) {
      return false;
    }
    return true;
  }, [isClaimed]);

  const useDeleteAddress = useCallback(async () => {
    if (keplr !== null) {
      if (
        selectedAddress !== null &&
        !selectedAddress.match(PATTERN_CYBER) &&
        citizenship !== null
      ) {
        const { nickname } = citizenship.extension;
        const msgObject = deleteAddressMsg(selectedAddress, nickname);
        try {
          const [{ address }] = await keplr.signer.getAccounts();
          const executeResponseResult = await keplr.execute(
            address,
            CONTRACT_ADDRESS_PASSPORT,
            msgObject,
            calculateFee(400000, gasPrice),
            'cyber'
          );
          console.log('executeResponseResult', executeResponseResult);
          if (executeResponseResult.code === 0) {
            updateTxHash({
              status: 'pending',
              txHash: executeResponseResult.transactionHash,
            });
            setStepApp(STEP_INFO.STATE_DELETE_IN_PROCESS);
          }

          if (executeResponseResult.code) {
            updateTxHash({
              txHash: executeResponseResult?.transactionHash,
              status: 'error',
              rawLog: executeResponseResult?.rawLog.toString(),
            });
          }
        } catch (error) {
          console.log('error', error);
          setStepApp(STEP_INFO.STATE_INIT);
        }
      }
    }
  }, [keplr, selectedAddress, citizenship]);

  const useGetSelectAddress = useMemo(() => {
    if (selectedAddress && selectedAddress !== null) {
      return (
        <span style={{ color: '#36d6ae', padding: '0 5px' }}>
          {trimString(selectedAddress, 10, 4)}
        </span>
      );
    }
    return '';
  }, [selectedAddress]);

  const onClickMMSigner = () => {
    setSelectNetwork('eth');
    setSelectMethod('MetaMask');
  };

  if (activeStep === STEP_INFO.STATE_INIT_NULL) {
    return (
      <ActionBarContainer>
        <BtnGrd
          onClick={() => history.push('/citizenship')}
          text="get citizenship"
        />
      </ActionBarContainer>
    );
  }

  if (
    activeStep === STEP_INFO.STATE_INIT_PROVE ||
    activeStep === STEP_INFO.STATE_PROVE
  ) {
    return (
      <ActionBarContainer>
        <BtnGrd
          disabled={isProve}
          onClick={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
          text="prove address"
        />
      </ActionBarContainer>
    );
  }

  if (activeStep === STEP_INFO.STATE_INIT_CLAIM) {
    return (
      <ActionBarContainer>
        <BtnGrd
          onClick={() => setStepApp(STEP_INFO.STATE_CLAIME)}
          text="go to claim"
        />
      </ActionBarContainer>
    );
  }

  if (
    activeStep === STEP_INFO.STATE_CLAIME_TO_PROVE ||
    activeStep === STEP_INFO.STATE_GIFT_NULL_ALL
  ) {
    return (
      <ActionBarSteps gridGap="35px">
        <BtnGrd
          disabled={isProve}
          onClick={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
          text="prove one more address"
        />
        <BtnGrd
          onClick={() => history.push('/teleport')}
          text={`buy ${BOOT_ICON}`}
        />
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_CONNECT) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_INIT_PROVE)}
        onClickFnc={() =>
          setStepApp(
            selectMethod === 'keplr'
              ? STEP_INFO.STATE_PROVE_SIGN_KEPLR
              : STEP_INFO.STATE_PROVE_SIGN_MM
          )
        }
        btnText="connect"
        disabled={selectMethod === ''}
      >
        <ButtonIcon
          onClick={() => setSelectMethod('keplr')}
          active={selectMethod === 'keplr'}
          img={imgKeplr}
          text="keplr"
        />
        <ButtonIcon
          onClick={() => onClickMMSigner()}
          active={selectMethod === 'MetaMask'}
          img={imgMetaMask}
          text="metaMask"
        />
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_SIGN_KEPLR) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
        onClickFnc={() => signMsgKeplr()}
        btnText="sign message"
        disabled={selectNetwork === ''}
      >
        <ButtonIcon
          onClick={() => setSelectNetwork('osmosis')}
          active={selectNetwork === 'osmosis'}
          img={imgOsmosis}
          text="osmosis"
        />
        <ButtonIcon
          onClick={() => setSelectNetwork('columbus-5')}
          active={selectNetwork === 'columbus-5'}
          img={imgTerra}
          text="terra"
        />
        <ButtonIcon
          onClick={() => setSelectNetwork('cosmoshub')}
          active={selectNetwork === 'cosmoshub'}
          img={imgCosmos}
          text="cosmoshub"
        />
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_SIGN_MM) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
        onClickFnc={() => signMsgETH()}
        btnText="sign message"
      >
        <ButtonIcon
          onClick={() => setSelectNetwork('eth')}
          active={selectNetwork === 'eth'}
          img={imgEth}
          text="eth"
        />
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_CHECK_ACCOUNT) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
      >
        address comparison <Dots />
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_CHANGE_ACCOUNT) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
      >
        choose {useAddressOwner} in keplr
      </ActionBarSteps>
    );
  }

  if (activeStep === STEP_INFO.STATE_PROVE_SEND_SIGN) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
      >
        <BtnGrd
          onClick={() => sendSignedMessage()}
          text="send signed message"
        />
      </ActionBarSteps>
    );
  }

  if (loadingGift && activeStep === STEP_INFO.STATE_RELEASE) {
    return (
      <ActionBarContainer>
        <BtnGrd pending />
      </ActionBarContainer>
    );
  }

  if (
    (activeStep === STEP_INFO.STATE_INIT_RELEASE ||
      activeStep === STEP_INFO.STATE_RELEASE) &&
    isClaimed
  ) {
    return (
      <ActionBarContainer>
        <BtnGrd onClick={() => history.push('/release')} text="go to release" />
      </ActionBarContainer>
    );
  }

  if (activeStep === STEP_INFO.STATE_CLAIME) {
    return (
      <ActionBarSteps gridGap="35px">
        <BtnGrd
          disabled={isProve}
          onClick={() => setStepApp(STEP_INFO.STATE_PROVE_CONNECT)}
          text="prove one more address"
        />
        <BtnGrd disabled={isClaime} onClick={() => useClaime()} text="claim" />
      </ActionBarSteps>
    );
  }
  if (activeStep === STEP_INFO.STATE_DELETE_ADDRESS) {
    return (
      <ActionBarSteps
        onClickBack={() => setStepApp(STEP_INFO.STATE_INIT)}
        onClickFnc={useDeleteAddress}
        btnText="delete"
      >
        you want to delete {useGetSelectAddress} from your passport
      </ActionBarSteps>
    );
  }

  if (
    activeStep === STEP_INFO.STATE_CLAIM_IN_PROCESS ||
    activeStep === STEP_INFO.STATE_PROVE_IN_PROCESS ||
    activeStep === STEP_INFO.STATE_DELETE_IN_PROCESS
  ) {
    return (
      <ActionBarContainer>
        <BtnGrd pending />
      </ActionBarContainer>
    );
  }

  /*
  if (step === STEP_INIT && activeStep === STEP_PROVE_ADD) {
    return (
      <ActionBarContainer>
        <BtnGrd
          disabled={isProve}
          onClick={() => funcChangeState(STEP_CONNECT, STEP_INFO.STATE_CONNECT)}
          text="prove address"
        />
      </ActionBarContainer>
    );
  }

  if (step === STEP_INIT && activeStep === STEP_CLAIME && isClaimed) {
    return (
      <ActionBarContainer>
        <BtnGrd
          onClick={() => history.push('/release')}
          text="go to release"
        />
      </ActionBarContainer>
    );
  }

  if (step === STEP_INIT && activeStep === STEP_CLAIME) {
    return (
      <ActionBarContainer>
        <BtnGrd
          disabled={isClaime}
          onClick={() => useClaime()}
          text={useSelectCyber ? 'claim all' : 'claim'}
        />
      </ActionBarContainer>
    );
  }

  if (step === STEP_CONNECT) {
    return (
      <ActionBarSteps
        onClickBack={() => funcChangeState(STEP_INIT, STEP_INFO.STATE_PROVE)}
        onClickFnc={() =>
          funcChangeState(
            STEP_SIGN,
            selectMethod === 'keplr'
              ? STEP_INFO.STATE_SIGN_KEPLR
              : STEP_INFO.STATE_SIGN_MM
          )
        }
        btnText="connect"
        disabled={selectMethod === ''}
      >
        <ButtonIcon
          onClick={() => setSelectMethod('keplr')}
          active={selectMethod === 'keplr'}
          img={imgKeplr}
          text="keplr"
        />
        <ButtonIcon
          onClick={() => setSelectMethod('MetaMask')}
          active={selectMethod === 'MetaMask'}
          img={imgMetaMask}
          text="metaMask"
        />
      </ActionBarSteps>
    );
  }

  if (step === STEP_SIGN && selectMethod === 'keplr') {
    return (
      <ActionBarSteps
        onClickBack={() =>
          funcChangeState(STEP_CONNECT, STEP_INFO.STATE_CONNECT)
        }
        onClickFnc={() => signMsgKeplr()}
        btnText="sign message"
        disabled={selectNetwork === ''}
      >
        <ButtonIcon
          onClick={() => setSelectNetwork('osmosis')}
          active={selectNetwork === 'osmosis'}
          img={imgOsmosis}
          text="osmosis"
        />
        <ButtonIcon
          onClick={() => setSelectNetwork('columbus-5')}
          active={selectNetwork === 'columbus-5'}
          img={imgTerra}
          text="terra"
        />
        <ButtonIcon
          onClick={() => setSelectNetwork('cosmoshub')}
          active={selectNetwork === 'cosmoshub'}
          img={imgCosmos}
          text="cosmoshub"
        />
      </ActionBarSteps>
    );
  }

  if (step === STEP_CHECK_ACCOUNT && selectMethod === 'keplr') {
    return (
      <ActionBarSteps onClickBack={() => setStep(STEP_CONNECT)}>
        address comparison <Dots />
      </ActionBarSteps>
    );
  }

  if (step === STEP_CHANGE_ACCOUNT && selectMethod === 'keplr') {
    return (
      <ActionBarSteps onClickBack={() => setStep(STEP_CONNECT)}>
        choose this address {addressOwner} in keplr
      </ActionBarSteps>
    );
  }

  if (step === STEP_SEND_SIGN) {
    return (
      <ActionBarSteps onClickBack={() => setStep(STEP_CONNECT)}>
        <BtnGrd
          onClick={() => sendSignedMessage()}
          text="send signed message"
        />
      </ActionBarSteps>
    );
  }

  if (step === STEP_SIGN && selectMethod === 'MetaMask') {
    return (
      <ActionBarSteps
        onClickBack={() => setStep(STEP_CONNECT)}
        onClickFnc={() => signMsgETH()}
        btnText="sign message"
      >
        <ButtonIcon
          onClick={() => setSelectNetwork('eth')}
          active={selectNetwork === 'eth'}
          img={imgEth}
          text="eth"
        />
      </ActionBarSteps>
    );
  }
  */

  return null;
}

export default ActionBarPortalGift;
