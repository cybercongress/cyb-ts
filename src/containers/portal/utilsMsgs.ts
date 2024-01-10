import Soft3jsMsgs from 'src/soft.js/api/msgs';
import BigNumber from 'bignumber.js';
import { coin } from '@cosmjs/launchpad';
import { CyberClient } from '@cybercongress/cyber-js';
import { CONTRACT_ADDRESS_GIFT } from './utils';

const LENGTH_INVESTMINT = 1041;

const mssgsClaim = async (
  signerInfo: { sender: string; isNanoLedger: boolean },
  releaseMsg: object[],
  availableRelease: number,
  queryClient?: CyberClient,
  onlyDelegate?: boolean
) => {
  const MsgsBroadcast = [];
  const { sender, isNanoLedger } = signerInfo;
  const soft3js = new Soft3jsMsgs(sender, queryClient);

  const amountStake = new BigNumber(availableRelease);

  releaseMsg.forEach((item) => {
    MsgsBroadcast.push(soft3js.execute(CONTRACT_ADDRESS_GIFT, item));
  });

  const resultMsgDelegate = await soft3js.delegateTokens(
    coin(amountStake.toString(), Soft3jsMsgs.denom())
  );

  MsgsBroadcast.push(resultMsgDelegate);

  if (isNanoLedger || onlyDelegate) {
    return MsgsBroadcast;
  }

  const resultConstructorMintSwap = await constructorMintSwap(
    soft3js,
    amountStake
  );

  MsgsBroadcast.push(...resultConstructorMintSwap);

  return MsgsBroadcast;
};

const constructorMintSwap = async (
  soft3js: Soft3jsMsgs,
  amountStake: BigNumber
) => {
  const MsgsBroadcast = [];
  const halfAmountStake = amountStake.dividedBy(2).dp(0, BigNumber.ROUND_FLOOR).toString();

  const resultMintA = await soft3js.investmint(
    coin(halfAmountStake, Soft3jsMsgs.liquidDenom()),
    'milliampere',
    LENGTH_INVESTMINT
  );

  if (resultMintA) {
    MsgsBroadcast.push(resultMintA);
  } else {
    const offerCoin = coin(
      halfAmountStake,
      Soft3jsMsgs.liquidDenom()
    );
    const resultSwapMsg = await soft3js.swap(5, offerCoin, 'milliampere');
    MsgsBroadcast.push(resultSwapMsg);
  }

  const resultMintV = await soft3js.investmint(
    coin(halfAmountStake, Soft3jsMsgs.liquidDenom()),
    'millivolt',
    LENGTH_INVESTMINT
  );

  if (resultMintV) {
    MsgsBroadcast.push(resultMintV);
  } else {
    const offerCoin = coin(
      halfAmountStake,
      Soft3jsMsgs.liquidDenom()
    );
    const resultSwapMsg = await soft3js.swap(6, offerCoin, 'millivolt');
    MsgsBroadcast.push(resultSwapMsg);
  }

  return MsgsBroadcast;
};

export default mssgsClaim;
