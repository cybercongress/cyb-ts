import { LsResult } from 'ipfs-core-types/src/pin';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import {
  CYBER_LINK_TRANSACTION_TYPE,
  Transaction,
} from 'src/types/transaction';
import {
  PinTypeMap,
  EntryTypeMap,
  EntryType,
  TransactionDbEntry,
  SyncStatusDbEntry,
} from './types';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { dateToNumber } from 'src/utils/date';

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
    sizeLocal: sizeLocal || -1,
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
): TransactionDbEntry => {
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
  entryType: EntryType,
  id: NeuronAddress | ParticleCid,
  timestamp: number,
  unreadCount: int,
  lastReadTimestamp: number = timestamp
): SyncStatusDbEntry => {
  return {
    entry_type: EntryTypeMap[entryType],
    id,
    timestamp,
    last_read_timestamp: lastReadTimestamp,
    unread_count: unreadCount,
    disabled: false,
  };
};

export const isTransactionCyberLink = (t: TransactionDbEntry) =>
  t.type === CYBER_LINK_TRANSACTION_TYPE;
