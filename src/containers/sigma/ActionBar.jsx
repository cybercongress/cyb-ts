import { useCallback, useContext } from 'react';
import { ActionBarSteps, BtnGrd } from '../portal/components';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';

function ActionBar({ updateFunc }) {
  const { keplr, initSigner } = useContext(AppContext);

  const connectKeplr = useCallback(async () => {
    if (keplr !== null) {
      const { bech32Address, name } = await keplr.signer.keplr.getKey(
        CYBER.CHAIN_ID
      );
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
      await initSigner();
    }
  }, [keplr, initSigner]);

  return (
    <ActionBarSteps>
      <BtnGrd onClick={connectKeplr} text="connect web3" />
    </ActionBarSteps>
  );
}

export default ActionBar;
