/* eslint-disable no-await-in-loop */
import React from 'react';
import {
  SigningCosmosClient,
  coins,
  GasPrice,
  BroadcastMode,
  OfflineSigner,
} from '@cosmjs/launchpad';
import { SigningCyberClient, CyberClient } from '@cybercongress/cyber-js';
import { Decimal } from '@cosmjs/math';
import { stringToPath } from '@cosmjs/crypto';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { CYBER } from '../../utils/config';

// ччы

class Signer {
  constructor() {
    this.prefix = CYBER.BECH32_PREFIX_ACC_ADDR_CYBER;
    this.word = 24;
    this.hdPath = stringToPath("m/44'/118'/0'/0/0");
    this.client = null;
    this.signer = null;
    this.msgsArr = [];
  }

  get getClient() {
    return this.client;
  }

  get getSigner() {
    return this.signer;
  }

  initSigner = async (defaultAccount) => {
    const { account } = defaultAccount;
    if (
      account &&
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      if (account.cyber.keys === 'cyberSigner' && account.cyber.secret) {
        const mnemonic = account.cyber.secret;
        const mnemonicString = atob(mnemonic);
        const signer = await Secp256k1HdWallet.fromMnemonic(mnemonicString, {
          prefix: this.prefix,
        });
        this.signer = signer;
        this.client = await this.createClient();

        return this.client;
      }
    }

    return null;
  };

  restorePhrase = async (mnemonic, callback) => {
    const signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: this.prefix,
    });

    this.signer = signer;
    this.client = await this.createClient();

    if (callback) {
      callback(this.client);
    }
    return this.client;
  };

  generationAccount = async () => {
    const address = await this.getVanityAccount();
    return address;
  };

  getVanityAccount = async (callback) => {
    try {
      let condition = true;
      while (condition) {
        const signer = await Secp256k1HdWallet.generate(this.word, {
          prefix: this.prefix,
        });
        const [{ address }] = await signer.getAccounts();
        if (address.match(/^bostrom1a[a-zA-Z0-9]{37}$/g)) {
          condition = false;
          if (callback) {
            callback(signer);
          }
          this.signer = signer;
          this.client = await this.createClient();

          return this.client;
        }
      }
    } catch (error) {
      console.log(`error`, error);
      return error;
    }
  };

  createClient = async () => {
    const client = await SigningCyberClient.connectWithSigner(
      CYBER.CYBER_NODE_URL_API,
      this.signer
    );

    return client;
  };

  sendTxs = async (msgs, callback) => {
    try {
      if (this.client !== null) {
        const [{ address }] = await this.client.signer.getAccounts();

        const fee = {
          amount: [],
          gas: '200000',
        };

        const response = await this.client.signAndBroadcast(
          address,
          msgs,
          fee,
          CYBER.MEMO_CYBER_SIGNER
        );
        console.log('response1', response);
        if (callback && callback !== null) {
          callback(response);
        }
        return response;
      }
    } catch (error) {
      console.log(`error`, error);
      return error;
    }
  };
}

export default Signer;
