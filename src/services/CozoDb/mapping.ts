import { LsResult } from 'ipfs-core-types/src/pin';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { PinTypeMap } from './types';

export const mapParticleToCozoEntity = (particle: IPFSContent): any => {
  const { cid, result, meta, textPreview } = particle;
  const { size, mime, type, blocks, sizeLocal } = meta;
  return {
    cid,
    size,
    mime: mime || 'unknown',
    type,
    text: textPreview || '',
    sizeLocal: sizeLocal || -1,
    blocks: blocks || 0,
  };
};

export const mapPinToEntity = (pin: LsResult) => ({
  cid: pin.cid.toString(),
  type: PinTypeMap[pin.type],
});

interface GenertiTransaction<T> {
  transaction_hash: string;
  value: T;
  transaction: {
    success: boolean;
    block: {
      timestamp: string;
    };
  };
  type: string;
}

interface MsgDelegateValue {
  amount: {
    denom: string;
    amount: string;
  };
  delegator_address: string;
  validator_address: string;
}

interface DelegateTransaction extends GenertiTransaction<MsgDelegateValue> {
  type: 'cosmos.staking.v1beta1.MsgDelegate';
}

interface AnyTransaction extends GenertiTransaction<Object> {
  type: 'cosmos.staking.v1beta1.MsgDelegate';
}

export type Transaction = DelegateTransaction | AnyTransaction;

export const mapTransactionToEntity = (tx: Transaction) => {
  const { transaction_hash, transaction, type, value } = tx;
  return {
    hash: transaction_hash,
    type,
    timestamp: new Date(transaction.block.timestamp).getTime(),
    value: JSON.stringify(value),
  };
};
