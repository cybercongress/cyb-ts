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
interface AnyTransaction extends GenertiTransaction<Object> {}

export type Transaction = DelegateTransaction | AnyTransaction;
