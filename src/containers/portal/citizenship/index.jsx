import React, { useEffect, useState, useCallback, useContext } from 'react';
import { connect } from 'react-redux';
import { calculateFee } from '@cosmjs/stargate';
import { GasPrice } from '@cosmjs/launchpad';
import { ContainerGradient, Signatures, ScrollableTabs } from '../components';
import { Welcome, Rules, InputNickname, Avatar } from '../stateComponent';
import ActionBar from './ActionBar';
import { getPin } from '../../../utils/search/utils';
import { AvataImgIpfs } from '../components/avataIpfs';
import { AppContext } from '../../../context';
import { CONTRACT_ADDRESS } from '../utils';

const STEP_INIT = 0;
const STEP_NICKNAME = 1;
const STEP_RULES = 2;
const STEP_AVATAR_UPLOAD = 3.1;
const STEP_AVATAR = 3.2;
const STEP_KEPLR_INIT = 4.1;
const STEP_KEPLR_SETUP = 4.2;
const STEP_KEPLR_CONNECT = 4.3;
const STEP_KEPLR_REGISTER = 5;
const STEP_DONE = 6;

const gasPrice = GasPrice.fromString('0.001boot');

function GetCitizenship({ node }) {
  const { keplr } = useContext(AppContext);
  const [step, setStep] = useState(STEP_DONE);
  const [valueNickname, setValueNickname] = useState('');
  const [avatarIpfs, setAvatarIpfs] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [txsHash, setTxsHash] = useState(
    'C7E9D7091A40E616F27A6F731CA6BC8EF87A1813E6224B0933CF474554DDD3C4'
  );

  useEffect(() => {
    const localStorageNickname = localStorage.getItem('nickname');
    if (localStorageNickname !== null) {
      const localStorageNicknameData = JSON.parse(localStorageNickname);
      setValueNickname(localStorageNicknameData);

      const localStorageAvatarCid = localStorage.getItem('avatarCid');
      if (localStorageAvatarCid !== null) {
        const localStorageAvatarCidData = JSON.parse(localStorageAvatarCid);
        setAvatarIpfs(localStorageAvatarCidData);
        setStep(STEP_KEPLR_REGISTER);
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

  const setupNickname = useCallback(() => {
    localStorage.setItem('nickname', JSON.stringify(valueNickname));
    setStep(STEP_RULES);
  }, [valueNickname]);

  const uploadAvatarImg = useCallback(() => {
    if (avatarIpfs !== null) {
      localStorage.setItem('avatarCid', JSON.stringify(avatarIpfs));
      setStep(STEP_KEPLR_REGISTER);
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
      const executeResponseResult = await keplr.execute(
        address,
        CONTRACT_ADDRESS,
        msgObject,
        calculateFee(400000, gasPrice),
        'cyber'
      );
      console.log('executeResponseResult', executeResponseResult);
      if (executeResponseResult.code === 0) {
        setTxsHash(executeResponseResult.transactionHash);
        setStep(STEP_DONE);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [valueNickname, avatarIpfs, keplr]);

  let content;

  console.log('step', step)

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
    content = <Avatar valueNickname={valueNickname} avatar="upload avatar" />;
  }

  if (step === STEP_KEPLR_REGISTER) {
    content = (
      <Avatar
        valueNickname={valueNickname}
        avatar={<AvataImgIpfs cidAvatar={avatarIpfs} node={node} />}
      />
    );
  }

  if (step === STEP_DONE) {
    content = (
      <Avatar
        valueNickname={valueNickname}
        avatar={<AvataImgIpfs cidAvatar={avatarIpfs} node={node} />}
        txs={txsHash}
      />
    );
  }

  return (
    <>
      <main className="block-body">
        <div
          style={{
            width: '60%',
            margin: '0px auto',
            display: 'grid',
            gap: '70px',
          }}
        >
          {content}
          {/* <ScrollableTabs items={items} active={0} /> */}

          {/* <button type="button" onClick={() => checkKeplr()}>
          keplr
        </button> */}
        </div>
      </main>
      <ActionBar
        step={step}
        setStep={setStep}
        setupNickname={setupNickname}
        uploadAvatarImg={uploadAvatarImg}
        avatarImg={avatarImg}
        setAvatarImg={setAvatarImg}
        avatarIpfs={avatarIpfs}
        onClickRegister={onClickRegister}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(GetCitizenship);
