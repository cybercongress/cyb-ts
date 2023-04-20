/* eslint-disable */
import { useCallback } from 'react';
import { BtnGrd } from 'src/components';
import { ActionBarSteps } from '../portal/components';
import { CYBER } from '../../utils/config';
import { useSigningClient } from 'src/contexts/signerClient';

function ActionBar({ updateFunc }) {
  const { signer, initSigner } = useSigningClient();

  const connectKeplr = useCallback(async () => {
    if (signer) {
      const { bech32Address, name } = await signer.keplr.getKey(CYBER.CHAIN_ID);
      const currenAddress = {
        bech32: bech32Address,
        keyWallet: 'keplr',
        name,
      };
      localStorage.setItem('sigmaAddress', JSON.stringify(currenAddress));
      if (updateFunc) {
        updateFunc();
      }
    } else if (initSigner) {
      console.log('initSigner');
      initSigner();
    }
  }, [signer, initSigner]);

  return (
    <ActionBarSteps>
      <BtnGrd onClick={connectKeplr} text="connect web3" />
    </ActionBarSteps>
  );
}

export default ActionBar;
