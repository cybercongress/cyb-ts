// import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';

import bip32 from 'bip32';
// import * as ecc from 'tiny-secp256k1';
// import bip39 from 'bip39';

// import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
// import { BIP32Interface } from 'bip32';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

import { Secp256k1HdWallet } from '@cosmjs/launchpad';
import { EnglishMnemonic, Bip39, Random } from '@cosmjs/crypto';
// const ecc = require('tiny-secp256k1');

// import { bech32 } from 'bech32';
const path = "m/44'/118'/0'/0/0"; // Standard BIP44 path for Cosmos. Adjust if necessary.
const bip39 = require('bip39');

// defaults to BIP39 English word list
// uses HEX strings for entropy
// const mnemonic = bip39.entropyToMnemonic('00000000000000000000000000000000');
// // => abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about

// console.log('------mnenemene', mnemonic);
// function generateRandomBytes(length) {
//   const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
//   return randomValues;
// }

const mnemonic =
  'picture check person they response slam post cement moon sorry nuclear price knock figure sugar distance remember lunar powder balance bleak weasel cherry review';

export async function derivePrivateKeyFromMnemonic(mnemonic: string) {
  // Ensure the mnemonic is valid
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  // Derive the seed from the mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Derive the node using the BIP32 path
  const node = bip32(ecc).fromSeed(seed);
  const child = node.derivePath(path);

  // Private key in Buffer format
  const privateKey = child.privateKey;

  // Convert private key to hex string if necessary
  const privateKeyHex = privateKey.toString('hex');

  console.log('Private Key:', privateKeyHex);
  return privateKeyHex;

  // You must wrap a tiny-secp256k1 compatible implementation
  // const bip32 = BIP32Factory(ecc);
  // Random.getBytes(32);
  // const node: BIP32Interface = bip32.fromBase58(
  //   'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi'
  // );

  // const child: BIP32Interface = node.derivePath('m/0/0');
  // return child.privateKey.toString('hex');
}

export function generateMnemonic() {
  const entropy = Bip39.encode(Random.getBytes(32)).toString();
  const mnemonic = new EnglishMnemonic(entropy);
  console.log('Mnemonic:', mnemonic.toString());
  return mnemonic.toString();
}

export async function createAccount() {
  // Generate a mnemonic
  //   const mnemonic = Secp256k1HdWallet.generateMnemonic();
  const mnemonic = generateMnemonic();
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'cosmos', // This prefix depends on the network (e.g., cosmos, osmo, etc.)
  });

  // const [{ address }] = await wallet.getAccounts();
  const accountsData = await wallet.getAccounts();
  console.log('Address:', accountsData[0].address);
  console.log('Mnemonic:', mnemonic); // Store this securely!
}

import { makeCosmoshubPath } from '@cosmjs/amino';

export const generateWalletFromMnemonic = async (
  mnemonic?: string,
  prefix = 'bostrom'
) => {
  // Generate a random mnemonic if none is provided
  // if (!mnemonic) {
  //   mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  // }

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix,
  });

  const accounts = await wallet.getAccounts();
  const { address, pubkey } = accounts[0];

  console.log(`Mnemonic: ${mnemonic}`);
  console.log(`Address: ${address}`);
  console.log(`Public Key: ${pubkey.toString()}`);

  return { wallet, mnemonic, address, pubkey };
};

// const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

// async function createDirectWalletFromMnemonic(mnemonic) {
//     const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
//         prefix: "cosmos",
//     });
//     const accounts = await wallet.getAccounts();
//     console.log("Address:", accounts[0].address);
// }
