import Soft3jsMsgs from 'src/soft.js/api/msgs';
import BigNumber from 'bignumber.js';
import { coin } from '@cosmjs/launchpad';
import { ClaimMsg } from './type';
import { CONTRACT_ADDRESS_GIFT } from '../utils';

const LENGTH_INVESTMINT = 1041;

const mssgsClaim = (
  msgs: ClaimMsg[],
  signerInfo: { sender: string; isNanoLedger: boolean },
  giftStats: { progressClaim: number; currentBonus: number },
  validatorAddress: string
) => {
  const MsgsBroadcast = [];
  const { progressClaim, currentBonus } = giftStats;
  const { sender, isNanoLedger } = signerInfo;
  const multipliedBy = new BigNumber(progressClaim).dividedBy(100);
  const soft3js = new Soft3jsMsgs(sender);

  msgs.forEach((item) => {
    const amountStake = new BigNumber(item.claim.gift_amount)
      .multipliedBy(currentBonus)
      .multipliedBy(multipliedBy)
      .dp(0, BigNumber.ROUND_FLOOR);

    MsgsBroadcast.push(soft3js.execute(CONTRACT_ADDRESS_GIFT, item));

    if (!multipliedBy.comparedTo(0)) {
      return;
    }

    MsgsBroadcast.push(
      soft3js.delegateTokens(
        validatorAddress,
        coin(amountStake.toString(), Soft3jsMsgs.denom())
      )
    );

    if (isNanoLedger) {
      return;
    }

    MsgsBroadcast.push(
      soft3js.investmint(
        coin(
          amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR).toString(),
          Soft3jsMsgs.liquidDenom()
        ),
        'milliampere',
        LENGTH_INVESTMINT
      ),
      soft3js.investmint(
        coin(
          amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR).toString(),
          Soft3jsMsgs.liquidDenom()
        ),
        'millivolt',
        LENGTH_INVESTMINT
      )
    );
  });

  return MsgsBroadcast;
};

export default mssgsClaim;
