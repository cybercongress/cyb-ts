import { GasPrice } from '@cosmjs/stargate';
import { Uint53 } from '@cosmjs/math';
import { coins } from '@cosmjs/proto-signing';

function calculateFee(gasLimit, gasPrice) {
  if (!gasLimit) {
    return {
      amount: 0,
      gas: 0,
    };
  }
  const processedGasPrice =
    typeof gasPrice === 'string' ? GasPrice.fromString(gasPrice) : gasPrice;

  const { denom, amount: gasPriceAmount } = processedGasPrice;

  const amount = gasPriceAmount.multiply(new Uint53(gasLimit)).toString();
  return {
    amount: coins(amount, denom),
    gas: gasLimit.toString(),
  };
}

export default {
  calculateFee,
};
