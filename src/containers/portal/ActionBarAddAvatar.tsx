import { useState, useRef, useEffect, useCallback } from 'react';
import { GasPrice } from '@cosmjs/launchpad';
import { useSigningClient } from 'src/contexts/signerClient';
import { Nullable } from 'src/types';
import txs from '../../utils/txs';
import { ActionBarSteps, ActionBarContainer } from './components';
import { Dots, BtnGrd } from '../../components';
import { CONTRACT_ADDRESS_PASSPORT } from './utils';
import { useBackend } from 'src/contexts/backend';

const STATE_INIT = 1;
const STATE_AVATAR = 15;
const STATE_AVATAR_IN_PROCESS = 15.1;

const gasPrice = GasPrice.fromString('0.001boot');

function ActionBarAddAvatar({ step, setStep, updateTxHash, citizenship }) {
  const { signingClient, signer } = useSigningClient();
  const { isIpfsInitialized, ipfsNode } = useBackend();

  const inputOpenFileRef = useRef();
  const [avatarIpfs, setAvatarIpfs] = useState<Nullable<string>>(null);
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
      if (isIpfsInitialized && avatarImg !== null) {
        const toCid = await ipfsNode?.addContent(avatarImg);
        console.log('toCid', toCid);
        setAvatarIpfs(toCid);
      }
    };
    getPinAvatar();
  }, [isIpfsInitialized, ipfsNode, avatarImg]);

  const uploadAvatarImg = useCallback(async () => {
    if (signer && signingClient) {
      if (avatarIpfs !== null && citizenship !== null) {
        try {
          const { nickname } = citizenship.extension;
          const msgObject = {
            update_avatar: {
              new_avatar: avatarIpfs,
              nickname,
            },
          };
          const [{ address }] = await signer.getAccounts();
          const executeResponseResult = await signingClient.execute(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarIpfs, signer, signingClient, citizenship]);

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

export default ActionBarAddAvatar;
