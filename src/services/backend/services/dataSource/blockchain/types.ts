import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { Delegation } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { CyberLinkSimple, NeuronAddress } from 'src/types/base';

interface GenericTransaction<T> {
  value: T;
  type: string;
  transaction_hash: string;
  transaction: {
    memo?: string;
    success: boolean;
    block: {
      timestamp: string;
    };
  };
}
export const MSG_SEND_TRANSACTION_TYPE = 'cosmos.bank.v1beta1.MsgSend';

export const MSG_MULTI_SEND_TRANSACTION_TYPE =
  'cosmos.bank.v1beta1.MsgMultiSend';

export const CYBER_LINK_TRANSACTION_TYPE = 'cyber.graph.v1beta1.MsgCyberlink';

const DELEGATION_TRANSACTION_TYPE = 'cosmos.staking.v1beta1.MsgDelegate';

interface Input {
  address: NeuronAddress;
  coins: Coin[];
}

interface Output {
  address: NeuronAddress;
  coins: Coin[];
}

export interface MsgMultiSendValue {
  inputs: Input[];
  outputs: Output[];
}

export interface MsgSendValue {
  amount: Coin[];
  from_address: NeuronAddress;
  to_address: NeuronAddress;
}

interface MsgDelegateValue {
  amount: Coin;
  delegator_address: NeuronAddress;
  validator_address: NeuronAddress;
}

export interface CyberLinkValue {
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

export interface MsgMultiSendTransaction
  extends GenericTransaction<MsgMultiSendValue> {
  type: typeof MSG_MULTI_SEND_TRANSACTION_TYPE;
}

export interface MsgSendTransaction extends GenericTransaction<MsgSendValue> {
  type: typeof MSG_SEND_TRANSACTION_TYPE;
}

export type Transaction =
  // | DelegateTransaction
  CyberLinkTransaction | MsgMultiSendTransaction | MsgSendTransaction;
