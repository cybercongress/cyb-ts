/* eslint-disable import/no-unused-modules */
import { Coin, OfflineSigner, StdFee } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { getNowUtcNumber } from 'src/utils/date';

import { DEFAULT_GAS_LIMITS } from 'src/constants/config';
import { LinkDto } from '../CozoDb/types/dto';
import { throwErrorOrResponse } from './errors';

import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';

const defaultFee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
} as StdFee;

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
  fee: StdFee = defaultFee
) => {
  const response = await signingClient!.cyberlink(neuron, from, to, fee);
  const result = throwErrorOrResponse(response);

  const { transactionHash } = result;
  const link = {
    from,
    to,
    transactionHash,
    timestamp: getNowUtcNumber(),
    neuron,
  } as LinkDto;

  // TODO: add from/toparticle to DB ??
  await senseApi?.putCyberlink(link);
  await senseApi?.addCyberlinkLocal(link);

  return transactionHash;
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
  const result = throwErrorOrResponse(response);
  const { transactionHash } = result;

  await senseApi?.addMsgSendAsLocal({
    transactionHash,
    fromAddress: address,
    toAddress: recipient,
    amount: offerCoin,
    memo,
  });

  return transactionHash;
};

export const investmint = async (
  address: NeuronAddress,
  amount: Coin,
  resource: string,
  length: number,
  signingClient: SigningCyberClient
) => {
  const response = await signingClient.investmint(
    address,
    amount,
    resource,
    length,
    'auto'
  );

  const { transactionHash } = throwErrorOrResponse(response);
  return transactionHash;
};

export const updatePassportParticle = async (
  nickname: string,
  particle: ParticleCid,
  {
    signer,
    signingClient,
  }: {
    signer: OfflineSigner;
    signingClient: SigningCyberClient;
  }
) => {
  const [{ address }] = await signer.getAccounts();

  const msgObject = {
    update_particle: {
      nickname,
      particle,
    },
  };
  return signingClient.execute(
    address,
    CONTRACT_ADDRESS_PASSPORT,
    msgObject,
    'auto'
  );
};
