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
import Web3 from 'web3';
import { calculateFee } from '@cosmjs/stargate';
import { coins, GasPrice } from '@cosmjs/launchpad';
import { connect } from 'react-redux';
import { toAscii, fromBase64, toBase64 } from '@cosmjs/encoding';
import { setDefaultAccount, setAccounts } from '../../../redux/actions/pocket';
import { ActionBarSteps } from '../../energy/component/actionBar';
import { ActionBarContentText, Dots, ButtonIcon } from '../../../components';
import { CYBER, LEDGER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import { AppContext } from '../../../context';
import { CONSTITUTION_HASH, CONTRACT_ADDRESS } from '../utils';

const imgKeplr = require('../../../image/keplr-icon.svg');
const imgMetaMask = require('../../../image/mm-logo.svg');
const imgEth = require('../../../image/Ethereum_logo_2014.svg');
const imgBostrom = require('../../../image/large-green.png');
const imgCosmos = require('../../../image/cosmos-2.svg');

const gasPrice = GasPrice.fromString('0.001boot');

const STEP_INIT = 0;
const STEP_CONNECT = 1;
const STEP_SIGN = 2;
const STEP_CHECK_ACCOUNT = 2.1;
const STEP_CHANGE_ACCOUNT = 2.2;
const STEP_SEND_SIGN = 3;

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

function ActionBarPortalGift({ citizenship, updateTxHash }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [step, setStep] = useState(STEP_INIT);
  const [selectMethod, setSelectMethod] = useState('');
  const [selectNetwork, setSelectNetwork] = useState('');
  const [signedMessageKeplr, setSignedMessageKeplr] = useState(null);

  useEffect(() => {
    const checkAddress = async () => {
      if (step === STEP_CHANGE_ACCOUNT || step === STEP_CHECK_ACCOUNT) {
        if (
          keplr !== null &&
          citizenship !== null &&
          selectMethod === 'keplr'
        ) {
          const [{ address }] = await keplr.signer.getAccounts();
          const { owner } = citizenship;
          if (address === owner) {
            setStep(STEP_SEND_SIGN);
          } else {
            setStep(STEP_CHANGE_ACCOUNT);
          }
        }
      }
    };
    checkAddress();
  }, [keplr, citizenship, selectMethod, step]);

  const addressOwner = useMemo(() => {
    if (citizenship !== null) {
      const { owner } = citizenship;
      return (
        <span style={{ color: '#36d6ae', padding: '0 5px' }}>
          {trimString(owner, 10, 4)}
        </span>
      );
    }
    return '';
  }, [citizenship]);

  const signMsgKeplr = useCallback(async () => {
    const keplrWindow = await getKeplr();
    if (keplrWindow && citizenship !== null) {
      const { owner } = citizenship;

      await keplrWindow.enable('cosmoshub');
      const signer = await keplrWindow.getOfflineSignerAuto('cosmoshub');

      const [{ address }] = await signer.getAccounts();
      const data = `${owner}:${CONSTITUTION_HASH}`;
      const res = await keplrWindow.signArbitrary('cosmoshub', address, data);

      const proveData = {
        pub_key: res.pub_key.value,
        signature: res.signature,
      };

      const proveDataBase64 = toBase64(toAscii(JSON.stringify(proveData)));
      setSignedMessageKeplr({ proveDataBase64, address });
      setStep(STEP_CHECK_ACCOUNT);
    }
    return null;
  }, [citizenship]);

  const proveAddressKeplr = useCallback(async () => {
    if (keplr !== null && citizenship !== null && signedMessageKeplr !== null) {
      const { nickname } = citizenship.extension;

      const msgObject = proofAddressMsg(
        signedMessageKeplr.address,
        nickname,
        signedMessageKeplr.proveDataBase64
      );

      try {
        const [{ address }] = await keplr.signer.getAccounts();
        const executeResponseResult = await keplr.execute(
          address,
          CONTRACT_ADDRESS,
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
          setStep(STEP_INIT);
        }
      } catch (error) {
        console.log('error', error);
        setStep(STEP_INIT);
      }
    }
  }, [keplr, citizenship, signedMessageKeplr]);

  const signMsgETH = async (owner) => {
    if (window.ethereum) {
      const { ethereum } = window;
      console.log('ethereum.isConnected()', ethereum.isConnected());

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      const account = accounts[0];
      const message = `${owner}:${CONSTITUTION_HASH}`;
      const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      const from = account;

      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'proveAddress'],
      });

      return { sign, account };
    }
    return null;
  };

  const proveAddressETH = useCallback(async () => {
    if (keplr !== null && citizenship !== null) {
      const { nickname } = citizenship.extension;
      const { owner } = citizenship;

      const signData = await signMsgETH(owner);

      if (signData !== null) {
        const msgObject = proofAddressMsg(
          signData.account,
          nickname,
          signData.sign
        );

        try {
          const [{ address }] = await keplr.signer.getAccounts();

          const executeResponseResult = await keplr.execute(
            address,
            CONTRACT_ADDRESS,
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
            setStep(STEP_INIT);
          }
        } catch (error) {
          console.log('error', error);
          setStep(STEP_INIT);
        }
      }
    }
  }, [keplr, citizenship]);

  if (step === STEP_INIT) {
    return (
      <ActionBarContainer>
        <Button onClick={() => setStep(STEP_CONNECT)}>prove address</Button>
      </ActionBarContainer>
    );
  }

  if (step === STEP_CONNECT) {
    return (
      <ActionBarSteps
        onClickBack={() => setStep(STEP_INIT)}
        onClickFnc={() => setStep(STEP_SIGN)}
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
        onClickBack={() => setStep(STEP_CONNECT)}
        onClickFnc={() => signMsgKeplr()}
        btnText="sign message"
      >
        {/* <ButtonIcon
              onClick={() => setSelectNetwork('bostrom')}
              active={selectNetwork === 'bostrom'}
              img={imgBostrom}
              text="bostrom"
            /> */}
        <ButtonIcon
          onClick={() => setSelectNetwork('cosmos')}
          active={selectNetwork === 'cosmos'}
          img={imgCosmos}
          text="cosmos"
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

  if (step === STEP_SEND_SIGN && selectMethod === 'keplr') {
    return (
      <ActionBarSteps onClickBack={() => setStep(STEP_CONNECT)}>
        <Button onClick={() => proveAddressKeplr()}>send signed message</Button>
      </ActionBarSteps>
    );
  }

  if (step === STEP_SIGN && selectMethod === 'MetaMask') {
    return (
      <ActionBarSteps
        onClickBack={() => setStep(STEP_CONNECT)}
        onClickFnc={() => proveAddressETH()}
        btnText="sign message"
      >
        <ButtonIcon
          onClick={() => setSelectNetwork('bosethtrom')}
          active={selectNetwork === 'eth'}
          img={imgEth}
          text="eth"
        />
      </ActionBarSteps>
    );
  }

  return null;
}

export default ActionBarPortalGift;
