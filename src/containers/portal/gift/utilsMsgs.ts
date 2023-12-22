import Soft3jsMsgs from 'src/soft.js/api/msgs';
import BigNumber from 'bignumber.js';
import { coin } from '@cosmjs/launchpad';
import { CONTRACT_ADDRESS_GIFT } from '../utils';

const LENGTH_INVESTMINT = 1041;

const mssgsClaim = (
  signerInfo: { sender: string; isNanoLedger: boolean },
  releaseMsg: object[],
  availableRelease: number,
  validatorAddress: string
) => {
  const MsgsBroadcast = [];
  const { sender, isNanoLedger } = signerInfo;
  const soft3js = new Soft3jsMsgs(sender);

  const amountStake = new BigNumber(availableRelease);

  releaseMsg.forEach((item) => {
    MsgsBroadcast.push(soft3js.execute(CONTRACT_ADDRESS_GIFT, item));
  });

  MsgsBroadcast.push(
    soft3js.delegateTokens(
      validatorAddress,
      coin(amountStake.toString(), Soft3jsMsgs.denom())
    )
  );

  if (isNanoLedger) {
    return MsgsBroadcast;
  }

  const halfAmountStake = amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR);

  if (halfAmountStake.comparedTo(100 * 10 ** 6) >= 0) {
    MsgsBroadcast.push(
      soft3js.investmint(
        coin(
          amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR).toString(),
          Soft3jsMsgs.liquidDenom()
        ),
        'milliampere',
        LENGTH_INVESTMINT
      )
    );
  }

  if (halfAmountStake.comparedTo(1 * 10 ** 9) >= 0) {
    MsgsBroadcast.push(
      soft3js.investmint(
        coin(
          amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR).toString(),
          Soft3jsMsgs.liquidDenom()
        ),
        'millivolt',
        LENGTH_INVESTMINT
      )
    );
  }

  return MsgsBroadcast;
};

export default mssgsClaim;
