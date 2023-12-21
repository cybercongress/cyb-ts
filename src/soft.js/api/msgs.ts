import { toUtf8 } from '@cosmjs/encoding';
import { Coin } from '@cosmjs/launchpad';
import { Uint53 } from '@cosmjs/math';
import Long from 'long';
import { CYBER } from 'src/utils/config';

class Soft3jsMsgs {
  private readonly senderAddress: string;

  private BASE_VESTING_TIME = 86401;

  static denom() {
    return CYBER.DENOM_CYBER;
  }

  static liquidDenom() {
    return CYBER.DENOM_LIQUID_TOKEN;
  }

  constructor(senderAddress: string) {
    this.senderAddress = senderAddress;
  }

  public investmint(
    amount: Coin,
    resource: 'millivolt' | 'milliampere',
    length: number
  ) {
    return {
      typeUrl: '/cyber.resources.v1beta1.MsgInvestmint',
      value: {
        neuron: this.senderAddress,
        amount,
        resource,
        length: Long.fromString(
          new Uint53(length * this.BASE_VESTING_TIME).toString()
        ),
      },
    };
  }

  public execute(
    contract: string,
    msg: Record<string, unknown>,
    funds?: readonly Coin[]
  ) {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: {
        sender: this.senderAddress,
        contract,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(funds || [])],
      },
    };
  }

  public delegateTokens(validatorAddress: string, amount: Coin) {
    return {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: {
        delegatorAddress: this.senderAddress,
        validatorAddress,
        amount,
      },
    };
  }
}

export default Soft3jsMsgs;
