import { LsResult } from 'ipfs-core-types/src/pin';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { Transaction } from 'src/types/transaction';
import { PinTypeMap } from './types';

export const mapParticleToEntity = (particle: IPFSContent): any => {
  const { cid, result, meta, textPreview } = particle;
  const { size, mime, type, blocks, sizeLocal } = meta;

  // hack to fix string command
  const text = textPreview?.replace(/"/g, "'") || '';
  return {
    cid,
    size,
    mime: mime || 'unknown',
    type,
    text,
    sizeLocal: sizeLocal || -1,
    blocks: blocks || 0,
  };
};

export const mapPinToEntity = (pin: LsResult) => ({
  cid: pin.cid.toString(),
  type: PinTypeMap[pin.type],
});

export const mapTransactionToEntity = (tx: Transaction) => {
  const { transaction_hash, transaction, type, value } = tx;
  return {
    hash: transaction_hash,
    type,
    timestamp: new Date(transaction.block.timestamp).getTime(),
    value: JSON.stringify(value),
    success: transaction.success,
  };
};
