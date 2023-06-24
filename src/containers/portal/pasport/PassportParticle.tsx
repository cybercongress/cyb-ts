import { useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { isCID } from 'src/utils/ipfs/helpers';

import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import Tooltip from 'src/components/tooltip/tooltip';
import { Input } from '../../../components';
import { CONTRACT_ADDRESS_PASSPORT } from '../utils';
import { updatePassportParticle } from '../utils';
import styles from './PassportParticle.module.scss';

function PassportParticle({
  nickname,
  particle,
}: {
  nickname: string;
  particle?: string;
}) {
  const { signer, signingClient } = useSigningClient();
  const [editParticle, setEditParticle] = useState(particle || '');
  const [resultMsg, setResultMsg] = useState('');

  if (!nickname || !signer || !signingClient) {
    return null;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEditParticle(value);
  };
  const onUpdate = async () => {
    if (isCID(editParticle)) {
      const result = await updatePassportParticle(nickname, editParticle, {
        signer,
        signingClient,
      });
      console.log('---res', result);

      setResultMsg(
        result?.code === 0
          ? `Particle updated: ${result.transactionHash}`
          : `Error: ${result?.rawLog.toString()}`
      );
    } else {
      setResultMsg('Invalid particle');
    }
  };

  return (
    <>
      <div className={styles.particleWrapper}>
        <div className={styles.title}>my particle: </div>
        <Input
          className={styles.input}
          color={Color.Pink}
          value={editParticle}
          onChange={onChange}
          placeholder="CIDv0 of particle..."
        />
        {particle !== editParticle && (
          <div className={styles.buttonWrapper}>
            <Tooltip tooltip="Update particle">
              <button type="button" onClick={onUpdate}>
                Update
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      {resultMsg && <div className={styles.message}>{resultMsg}</div>}
    </>
  );
}

export default PassportParticle;
