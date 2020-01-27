import bech32 from 'bech32';
import { CYBER } from './config';

const { BECH32_PREFIX_ACC_ADDR_CYBER } = CYBER;

const roundNumber = (num, scale) => {
  if (!`${num}`.includes('e')) {
    return +`${Math.floor(`${num}e+${scale}`)}e-${scale}`;
  }
  const arr = `${num}`.split('e');
  let sig = '';
  if (+arr[1] + scale > 0) {
    sig = '+';
  }
  const i = `${+arr[0]}e${sig}${+arr[1] + scale}`;
  const j = Math.floor(i);
  const k = +`${j}e-${scale}`;
  return k;
};

const formatNumber = (number, toFixed) => {
  let formatted = number;

  if (toFixed) {
    formatted = roundNumber(formatted, toFixed);
    formatted = formatted.toFixed(toFixed + 1);
  }
  // debugger;
  return formatted
    .toLocaleString('en')
    .replace(/(\.\d{0,})0+$/, '$1')
    .replace(/,/g, ' ');
};

const getDecimal = (number, toFixed) => {
  const nstring = number.toString();
  const narray = nstring.split('.');
  const result = narray.length > 1 ? narray[1] : '0';
  return result;
};

const run = async func => {
  try {
    await func();
  } catch (error) {
    setTimeout(run, 1000, func);
  }
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const timer = func => {
  setInterval(func, 1000);
};

const getDelegator = operatorAddr => {
  const address = bech32.decode(operatorAddr);
  return bech32.encode(BECH32_PREFIX_ACC_ADDR_CYBER, address.words);
};

const formatValidatorAddress = address => {
  if (address && address.length > 11) {
    return `${address.substring(0, 3)}...${address.substring(
      address.length - 8
    )}`;
  }
  if (address && address.length < 11) {
    return address;
  }
  return '';
};

const msgType = type => {
  switch (type) {
    // cyberd
    case 'cyberd/Link':
      return 'Link';

    // bank
    case 'cosmos-sdk/MsgSend':
      return 'Send';
    case 'cosmos-sdk/MsgMultiSend':
      return 'Multi Send';

    // staking
    case 'cosmos-sdk/MsgCreateValidator':
      return 'Create Validator';
    case 'cosmos-sdk/MsgEditValidator':
      return 'Edit Validator';
    case 'cosmos-sdk/MsgDelegate':
      return 'Delegate';
    case 'cosmos-sdk/MsgUndelegate':
      return 'Undelegate';
    case 'cosmos-sdk/MsgBeginRedelegate':
      return 'Redelegate';

    // gov
    case 'cosmos-sdk/MsgSubmitProposal':
      return 'Submit Proposal';
    case 'cosmos-sdk/MsgDeposit':
      return 'Deposit';
    case 'cosmos-sdk/MsgVote':
      return 'Vote';

    // distribution
    case 'cosmos-sdk/MsgWithdrawValidatorCommission':
      return 'Withdraw Commission';
    case 'cosmos-sdk/MsgWithdrawDelegationReward':
      return 'Withdraw Reward';
    case 'cosmos-sdk/MsgModifyWithdrawAddress':
      return 'Modify Withdraw Address';

    // slashing
    case 'cosmos-sdk/MsgUnjail':
      return 'Unjail';

    // ibc
    case 'cosmos-sdk/IBCTransferMsg':
      return 'IBCTransfer';
    case 'cosmos-sdk/IBCReceiveMsg':
      return 'IBC Receive';

    default:
      return { type };
  }
};

export {
  run,
  roundNumber,
  formatNumber,
  asyncForEach,
  timer,
  getDecimal,
  getDelegator,
  formatValidatorAddress,
  msgType,
};
