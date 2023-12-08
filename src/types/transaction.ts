import { TransactionDbEntry } from 'src/services/CozoDb/types';
import { CyberLinkType, NeuronAddress, ParticleCid } from './base';

interface GenericTransaction<T> {
  value: T;
  type: string;
}

export const CYBER_LINK_TRANSACTION_TYPE = 'cyber.graph.v1beta1.MsgCyberlink';
export const DELEGATION_TRANSACTION_TYPE = 'cosmos.staking.v1beta1.MsgDelegate';
export const TRANSFER_TRANSACTION_TYPE = 'cosmos/MsgTransfer';

interface AnyTransaction extends GenericTransaction<Object> {}

interface MsgDelegateValue {
  amount: {
    denom: string;
    amount: string;
  };
  delegator_address: string;
  validator_address: string;
}

export interface DelegateTransaction
  extends GenericTransaction<MsgDelegateValue> {
  transaction_hash: string;
  transaction: {
    success: boolean;
    block: {
      timestamp: string;
    };
  };
  type: typeof DELEGATION_TRANSACTION_TYPE;
}

interface CyberLinkValue {
  neuron: NeuronAddress;
  links: CyberLinkType[];
}

export interface CyberLinkTransaction
  extends GenericTransaction<CyberLinkValue> {
  type: typeof CYBER_LINK_TRANSACTION_TYPE;
  timestamp: number;
}

interface TransferValue {
  from_address: string;
  to_address: string;
  amount: {
    denom: string;
    amount: string;
  };
}

export interface TransferTransaction extends GenericTransaction<TransferValue> {
  type: typeof TRANSFER_TRANSACTION_TYPE;
}

export type Transaction =
  | DelegateTransaction
  | CyberLinkTransaction
  | TransferTransaction
  | AnyTransaction;
