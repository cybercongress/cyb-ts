import { LsResult } from 'ipfs-core-types/src/pin';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import { IPFSContent } from '../ipfs/ipfs';
import { LinkDbEntity, PinTypeMap } from './types/entities';
import { Transaction } from '../backend/services/dataSource/blockchain/types';
import { LinkDto, ParticleDto, PinDto, TransactionDto } from './types/dto';
import { CyberlinksByParticleResponse } from '../backend/services/dataSource/blockchain/requests';

export const mapParticleToEntity = (particle: IPFSContent): ParticleDto => {
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
export const mapPinToEntity = (pin: LsResult): PinDto => ({
  cid: pin.cid.toString(),
  type: PinTypeMap[pin.type],
});

export const mapTransactionToEntity = (
  neuron: string,
  tx: Transaction
): TransactionDto => {
  const {
    transaction_hash,
    transaction: {
      memo,
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
    memo,
    value,
    success,
    neuron,
  };
};

// export const mapSyncStatusToEntity = (
//   id: NeuronAddress | ParticleCid,
//   entryType: EntryType,
//   unreadCount: number,
//   timestampUpdate: number,
//   lastId: TransactionHash | ParticleCid = '',
//   timestampRead: number = timestampUpdate,
//   meta: Object = {}
// ): SyncStatusDbEntity => {
//   return {
//     entry_type: entryType,
//     id,
//     timestamp_update: timestampUpdate,
//     timestamp_read: timestampRead,
//     unread_count: unreadCount,
//     disabled: false,
//     last_id: lastId,
//     meta,
//   };
// };

export const mapLinkToEntity = (
  from: ParticleCid,
  to: ParticleCid,
  neuron: NeuronAddress = '',
  timestamp: number = 0
): LinkDbEntity => ({
  from,
  to,
  neuron,
  timestamp,
});

export const mapLinkFromIndexerToDbEntity = ({
  from,
  to,
  neuron,
  timestamp,
  transaction_hash,
}: CyberlinksByParticleResponse['cyberlinks'][0]): LinkDbEntity => ({
  from,
  to,
  neuron,
  timestamp: dateToNumber(timestamp),
  transaction_hash,
});
