import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { connect } from 'react-redux';
import txs from '../../utils/txs';
import { GasPrice } from '@cosmjs/launchpad';
import { ActionBarSteps, BtnGrd, ActionBarContainer } from './components';
import { Dots } from '../../components';
import { getPin } from '../../utils/search/utils';
import { AppContext } from '../../context';
import { CONTRACT_ADDRESS_PASSPORT } from './utils';

const STATE_INIT = 1;
const STATE_AVATAR = 15;
const STATE_AVATAR_IN_PROCESS = 15.1;

const gasPrice = GasPrice.fromString('0.001boot');

function ActionBarAddAvatar({
  step,
  setStep,
  node,
  updateTxHash,
  citizenship,
}) {
  const { keplr } = useContext(AppContext);

  const inputOpenFileRef = useRef();
  const [avatarIpfs, setAvatarIpfs] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);

  const onFilePickerChange = (files) => {
    const file = files.current.files[0];
    setAvatarImg(file);
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

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

  const uploadAvatarImg = useCallback(async () => {
    if (keplr !== null) {
      if (avatarIpfs !== null && citizenship !== null) {
        try {
          const { nickname } = citizenship.extension;
          const msgObject = {
            update_avatar: {
              new_avatar: avatarIpfs,
              nickname,
            },
          };
          const [{ address }] = await keplr.signer.getAccounts();
          const executeResponseResult = await keplr.execute(
            address,
            CONTRACT_ADDRESS_PASSPORT,
            msgObject,
            txs.calculateFee(500000, gasPrice),
            'cyber'
          );
          if (executeResponseResult.code === 0) {
            updateTxHash({
              status: 'pending',
              txHash: executeResponseResult.transactionHash,
            });
            setStep(STATE_AVATAR_IN_PROCESS);
          }

          if (executeResponseResult.code) {
            updateTxHash({
              txHash: executeResponseResult?.transactionHash,
              status: 'error',
              rawLog: executeResponseResult?.rawLog.toString(),
            });
            setStep(STATE_INIT);
          }
        } catch (error) {
          console.log('error', error);
          setStep(STATE_INIT);
        }
      } else {
        setStep(STATE_AVATAR);
      }
    }
  }, [avatarIpfs, keplr, citizenship]);

  if (step === STATE_AVATAR) {
    return (
      <ActionBarSteps onClickBack={() => setStep(STATE_INIT)}>
        <input
          ref={inputOpenFileRef}
          onChange={() => onFilePickerChange(inputOpenFileRef)}
          type="file"
          style={{ display: 'none' }}
        />
        {avatarIpfs === null ? (
          <BtnGrd onClick={showOpenFileDlg} text="Upload new avatar" />
        ) : (
          <BtnGrd
            disabled={avatarIpfs === null}
            onClick={uploadAvatarImg}
            text={avatarIpfs == null ? <Dots /> : 'Upload'}
          />
        )}
      </ActionBarSteps>
    );
  }

  if (step === STATE_AVATAR_IN_PROCESS) {
    return (
      <ActionBarContainer>
        <BtnGrd pending />
      </ActionBarContainer>
    );
  }

  return null;
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(ActionBarAddAvatar);
