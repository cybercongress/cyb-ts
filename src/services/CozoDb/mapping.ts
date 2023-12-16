import { LsResult } from 'ipfs-core-types/src/pin';
import { IPFSContent } from 'src/utils/ipfs/ipfs';

import {
  PinTypeMap,
  EntryType,
  TransactionDbEntity,
  SyncStatusDbEntity,
} from './types';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import { dateToNumber } from 'src/utils/date';
import { Transaction } from '../backend/workers/background/services/blockchain/types';

export const mapParticleToEntity = (particle: IPFSContent): any => {
  const { cid, result, meta, textPreview } = particle;
  const { size, mime, type, blocks, sizeLocal } = meta;
  // hack to fix string command
  const text = textPreview?.replace(/"/g, "'") || '';
  return {
    cid,
    size: size || 0,
    mime: mime || 'unknown',
    type,
    text,
    size_local: sizeLocal || -1,
    blocks: blocks || 0,
  };
};

//TODO: REFACTOR
export const mapPinToEntity = (pin: LsResult) => ({
  cid: pin.cid.toString(),
  type: PinTypeMap[pin.type],
});

export const mapTransactionToEntity = (
  neuron: string,
  tx: Transaction
): TransactionDbEntity => {
  const {
    transaction_hash,
    transaction: {
      block: { timestamp },
      success,
    },
    type,
    value,
  } = tx;
  return {
    hash: transaction_hash,
    type,
    timestamp: dateToNumber(timestamp),
    // value: JSON.stringify(value),
    value,
    success,
    neuron,
  };
};

export const mapSyncStatusToEntity = (
  id: NeuronAddress | ParticleCid,
  entryType: EntryType,
  unreadCount: number,
  timestampUpdate: number,
  lastId: TransactionHash | ParticleCid = '',
  timestampRead: number = timestampUpdate,
  meta: Object = {}
): SyncStatusDbEntity => {
  return {
    entry_type: entryType,
    id,
    timestamp_update: timestampUpdate,
    timestamp_read: timestampRead,
    unread_count: unreadCount,
    disabled: false,
    last_id: lastId,
    meta,
  };
};

export const mapLinkToEntity = (
  from: ParticleCid,
  to: ParticleCid,
  neuron: NeuronAddress = '',
  timestamp: number = 0
) => ({
  from,
  to,
  neuron,
  timestamp,
});
