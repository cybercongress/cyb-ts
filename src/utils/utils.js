import bech32 from 'bech32';
import { CYBER } from './config';

const DEFAULT_DECIMAL_DIGITS = 3;
const DEFAULT_CURRENCY = 'GOL';

const ORDER = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC',
};

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

const PREFIXES = [
  {
    prefix: 'T',
    power: 10 ** 12,
  },
  {
    prefix: 'G',
    power: 10 ** 9,
  },
  {
    prefix: 'M',
    power: 10 ** 6,
  },
  {
    prefix: 'K',
    power: 10 ** 3,
  },
];

export function formatCurrency(
  value,
  currency = DEFAULT_CURRENCY,
  decimalDigits = DEFAULT_DECIMAL_DIGITS
) {
  const { prefix = '', power = 1 } =
    PREFIXES.find(({ power }) => value >= power) || {};

  return `${roundNumber(
    value / power,
    decimalDigits
  )} ${prefix}${currency.toLocaleUpperCase()}`;
}

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

const getDelegator = (operatorAddr, prefix = BECH32_PREFIX_ACC_ADDR_CYBER) => {
  const address = bech32.decode(operatorAddr);
  return bech32.encode(prefix, address.words);
};

const trimString = (address, firstArg, secondArg) => {
  const first = firstArg || 3;
  const second = secondArg || 8;

  if (address && address.length > 11) {
    return `${address.substring(0, first)}...${address.substring(
      address.length - second
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

const exponentialToDecimal = exponential => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes('e+')) {
    const exponentialSplitted = decimal.split('e+');
    let postfix = '';
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes('.')
          ? exponentialSplitted[0].split('.')[1].length
          : 0);
      i++
    ) {
      postfix += '0';
    }
    const addCommas = text => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)},${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
  }
  if (decimal.toLowerCase().includes('e-')) {
    const exponentialSplitted = decimal.split('e-');
    let prefix = '0.';
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += '0';
    }
    decimal = prefix + exponentialSplitted[0].replace('.', '');
  }
  return decimal;
};

function dhm(t) {
  const cd = 24 * 60 * 60 * 1000;
  const ch = 60 * 60 * 1000;
  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.round((t - d * cd - h * ch) / 60000);
  const pad = function(n, unit) {
    return n < 10 ? `0${n}${unit}` : n;
  };
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return [`${d}d`, pad(h, 'h'), pad(m, 'm')].join(':');
}

const sort = (data, sortKey, ordering = ORDER.DESC) => {
  if (ordering === ORDER.NONE) {
    return data;
  }
  if (sortKey === 'timestamp') {
    return data.sort((a, b) => {
      const x = new Date(a[sortKey]);
      const y = new Date(b[sortKey]);
      if (ordering === ORDER.ASC) {
        return x - y;
      }
      return y - x;
    });
  }
  return data.sort((a, b) => {
    const x = a[sortKey];
    const y = b[sortKey];
    if (ordering === ORDER.ASC) {
      return x - y;
    }
    return y - x;
  });
};

const downloadObjectAsJson = (exportObj, exportName) => {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportObj)
  )}`;
  const downloadAnchorNode = document.createElement('a');

  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const getTimeRemaining = endtime => {
  const t = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days,
    hours,
    minutes,
    seconds,
  };
};

const isMobileTablet = () => {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export {
  run,
  sort,
  roundNumber,
  formatNumber,
  asyncForEach,
  timer,
  getDecimal,
  getDelegator,
  trimString,
  msgType,
  exponentialToDecimal,
  dhm,
  downloadObjectAsJson,
  getTimeRemaining,
  isMobileTablet,
};
