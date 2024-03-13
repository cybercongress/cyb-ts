/* eslint-disable import/no-unused-modules */
import { Coin, StdFee } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import { IpfsApi } from 'src/services/backend/workers/background/worker';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { DEFAULT_GAS_LIMITS, PATTERN_IPFS_HASH } from 'src/utils/config';

export const addIfpsMessageOrCid = async (
  message: string | ParticleCid,
  { ipfsApi }: { ipfsApi: IpfsApi | null }
) => {
  if (!ipfsApi) {
    throw Error('IpfsApi is not initialized');
  }

  return (
    !message.match(PATTERN_IPFS_HASH)
      ? ((await ipfsApi!.addContent(message)) as string)
      : message
  ) as ParticleCid;
};

export const sendCyberlink = async (
  address: NeuronAddress,
  fromCid: ParticleCid,
  toCid: ParticleCid,
  {
    senseApi,
    signingClient,
  }: {
    senseApi: SenseApi;
    signingClient: SigningCyberClient;
  },
  fee: StdFee = {
    amount: [],
    gas: DEFAULT_GAS_LIMITS.toString(),
  } as StdFee
) => {
  const response = await signingClient!.cyberlink(address, fromCid, toCid, fee);
  if (response.code === 0) {
    const txHash = response.transactionHash;
    // await senseApi?.addMsgSendAsLocal({
    //   transactionHash: txHash,
    //   fromAddress: address,
    //   toAddress: recipient,
    //   amount: offerCoin,
    //   memo: memoAsCid,
    // });

    return txHash;
  }

  console.log('error', response);
  throw Error(response.rawLog.toString());
};

export const sendTokensWithMessage = async (
  address: NeuronAddress,
  recipient: string,
  offerCoin: Coin[],
  memo: string | ParticleCid,
  {
    senseApi,
    signingClient,
  }: { signingClient: SigningCyberClient; senseApi: SenseApi }
) => {
  const response = await signingClient.sendTokens(
    address,
    recipient,
    offerCoin,
    'auto',
    memo
  );

  if (response.code === 0) {
    const txHash = response.transactionHash;
    await senseApi?.addMsgSendAsLocal({
      transactionHash: txHash,
      fromAddress: address,
      toAddress: recipient,
      amount: offerCoin,
      memo,
    });

    return txHash;
  }

  console.log('error', response);
  throw Error(response.rawLog.toString());
};
