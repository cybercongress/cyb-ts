/* eslint-disable no-await-in-loop */
import React from 'react';
import {
  Secp256k1HdWallet,
  SigningCosmosClient,
  coins,
} from '@cosmjs/launchpad';
import { stringToPath } from '@cosmjs/crypto';
import { CYBER } from '../../utils/config';

class Signer {
  constructor() {
    this.prefix = CYBER.BECH32_PREFIX_ACC_ADDR_CYBER;
    this.word = 24;
    this.hdPath = stringToPath("m/44'/118'/0'/0/0");
  }

  initSigner = async () => {
    const localStorageSecret = localStorage.getItem('secret');
    if (localStorageSecret !== null) {
      const localStorageSecretData = JSON.parse(localStorageSecret);
      const mnemonic = localStorageSecretData;
      const signer = await Secp256k1HdWallet.fromMnemonic(
        mnemonic,
        this.hdPath,
        this.prefix
      );

      return signer;
    }
    return null;
  };

  generationAccount = async () => {
    const address = await this.getVanityAccount();
    return address;
  };

  getVanityAccount = async () => {
    try {
      let condition = true;
      while (condition) {
        const signer = await Secp256k1HdWallet.generate(
          this.word,
          this.hdPath,
          this.prefix
        );
        const [{ address }] = await signer.getAccounts();
        if (address.match(/^cyber1a[a-zA-Z0-9]{37}$/g)) {
          condition = false;
          return signer;
        }
      }
    } catch (error) {
      console.log(`error`, error);
      return error;
    }
  };

  sendTxs = async (signer, msgs) => {
    try {
      const [{ address }] = await signer.getAccounts();
      const client = new SigningCosmosClient(
        CYBER.CYBER_NODE_URL_LCD,
        address,
        signer
      );

      const fee = {
        amount: coins(0, 'uatom'),
        gas: '100000',
      };

      const response = await client.signAndBroadcast(
        msgs,
        fee,
        CYBER.MEMO_CYBER_SIGNER
      );
      return response;
    } catch (error) {
      console.log(`error`, error);
      return error;
    }
  };
}

export default Signer;
