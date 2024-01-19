import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import {
  MsgSendTransaction,
  CyberLinkTransaction,
  MsgMultiSendTransaction,
} from '../services/dataSource/blockchain/types';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { LinkDirection } from '../services/sync/types';

export type SenseTransaction =
  | MsgSendTransaction
  | MsgMultiSendTransaction
  | CyberLinkTransaction;

export type SenseChat = {
  userAddress: NeuronAddress;
  last: SenseChatMessage;
  transactions: TransactionDto[];
};

export type SenseUnread = {
  entryType: EntryType;
  unread: number;
};

type ParticlePreResolved = { cid?: ParticleCid; text: string; mime: string };

type SenseTweetMeta = {
  lastId: ParticlePreResolved;
};

type SenseParticleMeta = {
  direction: LinkDirection;
};

type SenseParticleResultMeta = {
  id: ParticlePreResolved;
  lastId: ParticlePreResolved;
} & SenseParticleMeta;

// type SenseUserMeta = {
//   value: SenseTransaction['value'];
//   memo?: string;
//   type: string;
// };

type SenseTransactionMeta = {
  memo?: string;
};

export type SenseChatMessage = {
  amount: Coin[];
  memo?: string;
  direction: LinkDirection;
};

export type SenseMeta =
  | SenseParticleMeta
  // | SenseUserMeta
  | SenseChatMessage
  | SenseTransactionMeta
  | SenseTweetMeta;

export type SenseListItem = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCont: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
  meta: SenseMeta;
};
