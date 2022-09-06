import React, { useState, useEffect, useContext } from 'react';
import { SigningCosmosClient, GasPrice } from '@cosmjs/launchpad';
import { SigningCyberClient, CyberClient } from '@cybercongress/cyber-js';
import { Decimal } from '@cosmjs/math';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

import { CYBER } from './utils/config';
import { configKeplr } from './utils/keplrUtils';

const valueContext = {
  keplr: null,
  ws: null,
  jsCyber: null,
  updatejsCyber: () => {},
};

export const AppContext = React.createContext(valueContext);

export const useContextProvider = () => useContext(AppContext);

export async function createClient(signer) {
  if (signer) {
    const firstAddress = (await signer.getAccounts())[0].address;
    // const gasPrice = new GasPrice(Decimal.fromAtomics(0, 0), 'boot');
    const gasPrice = GasPrice.fromString('0.001boot');

    const gasLimits = {
      send: 200000,
      cyberlink: 256000,
      investmint: 160000,
      createRoute: 128000,
      editRoute: 128000,
      editRouteAlias: 128000,
      deleteRoute: 128000,
    };
    const options = { gasPrice, gasLimits };
    const client = await SigningCyberClient.connectWithSigner(
      CYBER.CYBER_NODE_URL_API,
      signer
    );

    // client.firstAddress = firstAddress;
    // const cosmJS = new SigningCyberClient(
    //   CYBER.CYBER_NODE_URL_LCD,
    //   firstAddress,
    //   signer,
    //   gasPrice,
    //   gasLimits,
    //   'sync'
    // );

    return client;
  }
  return null;
}

const AppContextProvider = ({ children }) => {
  const [value, setValue] = useState(valueContext);
  const [signer, setSigner] = useState(null);
  const [client, setClient] = useState(null);

  const updatejsCyber = (rpc) => {
    const createQueryCliet = async () => {
      const tendermintClient = await Tendermint34Client.connect(rpc);
      const queryClient = new CyberClient(tendermintClient);

      setValue((item) => ({
        ...item,
        jsCyber: queryClient,
      }));
    };
    createQueryCliet();
  };

  useEffect(() => {
    const createQueryCliet = async () => {
      const tendermintClient = await Tendermint34Client.connect(
        CYBER.CYBER_NODE_URL_API
      );
      const queryClient = new CyberClient(tendermintClient);
      setValue((item) => ({
        ...item,
        jsCyber: queryClient,
      }));
    };
    createQueryCliet();
  }, []);

  useEffect(() => {
    if (signer !== null) {
      const updateClient = async () => {
        const clientJs = await createClient(signer);
        setClient(clientJs);
      };
      updateClient();
    }
  }, [signer]);

  useEffect(() => {
    window.onload = async () => {
      init();
    };
  }, []);

  useEffect(() => {
    // window.addEventListener('keplr_keystorechange', init());
    window.addEventListener('keplr_keystorechange', () => {
      console.log(
        'Key store in Keplr is changed. You may need to refetch the account info.'
      );
      init();
    });
  }, []);

  const init = async () => {
    console.log(`window.keplr `, window.keplr);
    console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
    if (window.keplr || window.getOfflineSignerAuto) {
      if (window.keplr.experimentalSuggestChain) {
        await window.keplr.experimentalSuggestChain(configKeplr());
        await window.keplr.enable(CYBER.CHAIN_ID);
        const offlineSigner = await window.getOfflineSignerAuto(CYBER.CHAIN_ID);
        console.log(`offlineSigner`, offlineSigner);
        setSigner(offlineSigner);
      }
    }
  };

  useEffect(() => {
    if (client !== null) {
      setValue((item) => ({
        ...item,
        keplr: client,
        ws: CYBER.CYBER_WEBSOCKET_URL,
      }));
    }
  }, [client]);

  console.log('value', value);

  if (value.jsCyber && value.jsCyber === null) {
    return <div>...</div>;
  }

  return (
    <AppContext.Provider value={{ ...value, updatejsCyber }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
