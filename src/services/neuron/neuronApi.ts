/* eslint-disable import/no-unused-modules */
import { Coin, StdFee } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { DEFAULT_GAS_LIMITS } from 'src/utils/config';
import { getNowUtcNumber } from 'src/utils/date';

import { LinkDto } from '../CozoDb/types/dto';
import { throwErrorOrResponse } from './errors';

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
  const result = throwErrorOrResponse(response);

  const { transactionHash } = result;
  const link = {
    from,
    to,
    transactionHash,
    timestamp: getNowUtcNumber(),
    neuron,
  } as LinkDto;

  await senseApi?.putCyberlinsks(link);
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
