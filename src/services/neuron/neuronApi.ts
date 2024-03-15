/* eslint-disable import/no-unused-modules */
import { Coin, StdFee } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import { IpfsApi } from 'src/services/backend/workers/background/worker';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { DEFAULT_GAS_LIMITS, PATTERN_IPFS_HASH } from 'src/utils/config';
import { isString } from 'lodash';
import { LinkDto } from '../CozoDb/types/dto';
import { getNowUtcNumber } from 'src/utils/date';

export const addIfpsMessageOrCid = async (
  message: string | ParticleCid | File,
  { ipfsApi }: { ipfsApi: IpfsApi | null }
) => {
  if (!ipfsApi) {
    throw Error('IpfsApi is not initialized');
  }

  return (
    isString(message) && message.match(PATTERN_IPFS_HASH)
      ? message
      : ((await ipfsApi!.addContent(message)) as string)
  ) as ParticleCid;
};

const processSigningClientResponse = async (response: any) => {
  if (response.code === 0) {
    return response.transactionHash;
  }

  console.log('error', response);
  throw Error(response.rawLog.toString());
};

export const sendCyberlink = async (
  neuron: NeuronAddress,
  from: ParticleCid,
  to: ParticleCid,
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
  const response = await signingClient!.cyberlink(neuron, from, to, fee);
  if (response.code === 0) {
    const txHash = response.transactionHash;
    const link = {
      from,
      to,
      transactionHash: txHash,
      timestamp: getNowUtcNumber(),
      neuron,
    } as LinkDto;
    await senseApi?.putCyberlinsks(link);
    await senseApi?.addCyberlinkLocal(link);

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
