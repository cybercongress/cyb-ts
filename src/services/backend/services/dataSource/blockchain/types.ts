import { CyberLinkSimple, NeuronAddress } from 'src/types/base';

interface GenericTransaction<T> {
  value: T;
  type: string;
  transaction_hash: string;
  transaction: {
    success: boolean;
    block: {
      timestamp: string;
    };
  };
}

export const CYBER_LINK_TRANSACTION_TYPE = 'cyber.graph.v1beta1.MsgCyberlink';
export const DELEGATION_TRANSACTION_TYPE = 'cosmos.staking.v1beta1.MsgDelegate';
export const TRANSFER_TRANSACTION_TYPE = 'cosmos/MsgTransfer';

interface MsgDelegateValue {
  amount: {
    denom: string;
    amount: string;
  };
  delegator_address: NeuronAddress;
  validator_address: NeuronAddress;
}

interface TransferValue {
  from_address: NeuronAddress;
  to_address: NeuronAddress;
  amount: {
    denom: string;
    amount: string;
  };
}

interface CyberLinkValue {
  neuron: NeuronAddress;
  links: CyberLinkSimple[];
}

export interface DelegateTransaction
  extends GenericTransaction<MsgDelegateValue> {
  type: typeof DELEGATION_TRANSACTION_TYPE;
}

export interface CyberLinkTransaction
  extends GenericTransaction<CyberLinkValue> {
  type: typeof CYBER_LINK_TRANSACTION_TYPE;
}

export interface TransferTransaction extends GenericTransaction<TransferValue> {
  type: typeof TRANSFER_TRANSACTION_TYPE;
}

// interface AnyTransaction extends GenericTransaction<{}> {}

export type Transaction =
  | DelegateTransaction
  | CyberLinkTransaction
  | TransferTransaction;
//   | AnyTransaction;
