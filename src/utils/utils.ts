/* eslint-disable no-await-in-loop */
import bech32 from 'bech32';
import { fromUtf8 } from '@cosmjs/encoding';
import { Sha256 } from '@cosmjs/crypto';
import BigNumber from 'bignumber.js';
import { ObjKeyValue } from 'src/types/data';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { Option } from 'src/types';
import { CYBER } from './config';
import tokenList from './tokenList';

import cyberSpace from '../image/large-purple-circle.png';
import customNetwork from '../image/large-orange-circle.png';
import cyberBostrom from '../image/large-green.png';

const DEFAULT_DECIMAL_DIGITS = 3;
const DEFAULT_CURRENCY = 'GoL';

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

function numberWithCommas(x) {
  const parts = x.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

const formatNumber = (number: number | string, toFixed?: number): string => {
  let formatted = number;

  if (toFixed) {
    formatted = roundNumber(formatted, toFixed);
    formatted = formatted.toFixed(toFixed + 1);
  }

  if (typeof number === 'string') {
    return numberWithCommas(formatted);
  }

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
  decimalDigits = DEFAULT_DECIMAL_DIGITS,
  prefixCustom = PREFIXES
) {
  const { prefix = '', power = 1 } =
    prefixCustom.find((obj) => value >= obj.power) || {};

  return `${roundNumber(
    value / power,
    decimalDigits
  )} ${prefix}${currency.toLocaleUpperCase()}`;
}

const getDecimal = (number, toFixed) => {
  const nstring = number.toString();
  const narray = nstring.split('.');
  const result = narray.length > 1 ? narray[1] : '000';
  return result;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const fromBech32 = (operatorAddr, prefix = BECH32_PREFIX_ACC_ADDR_CYBER) => {
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

const exponentialToDecimal = (exponential) => {
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
    decimal = exponentialSplitted[0].replace('.', '') + postfix;
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
  const pad = (n, unit) => {
    return n < 10 ? `0${n}${unit}` : `${n}${unit}`;
  };
  if (m === 60) {
    h += 1;
    m = 0;
  }
  if (h === 24) {
    d += 1;
    h = 0;
  }
  return [`${d}d`, pad(h, 'h'), pad(m, 'm')].join(':');
}

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

const isMobileTablet = () => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      const UA = navigator.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
};

const coinDecimals = (number) => {
  return number * 10 ** -18;
};

const convertResources = (number) => {
  return Math.floor(number * 10 ** -3);
};

function timeSince(timeMS) {
  const seconds = Math.floor(timeMS / 1000);

  if (seconds === 0) {
    return 'now';
  }

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

const reduceBalances = (data): ObjKeyValue => {
  try {
    let balances = {};
    if (Object.keys(data).length > 0) {
      balances = data.reduce(
        (obj, item) => ({
          ...obj,
          [item.denom]: parseFloat(item.amount),
        }),
        {}
      );
    }
    return balances;
  } catch (error) {
    console.log(`error reduceBalances`, error);
    return {};
  }
};

// example: oneLiner -> message.module=wasm&message.action=/cosmwasm.wasm.v1.MsgStoreCode&store_code.code_id=${codeId}
function makeTags(oneLiner) {
  return oneLiner.split('&').map((pair) => {
    if (pair.indexOf('=') === -1) {
      throw new Error('Parsing error: Equal sign missing');
    }
    const parts = pair.split('=');
    if (parts.length > 2) {
      throw new Error(
        'Parsing error: Multiple equal signs found. If you need escaping support, please create a PR.'
      );
    }
    const [key, value] = parts;
    if (!key) {
      throw new Error('Parsing error: Key must not be empty');
    }
    return { key, value };
  });
}

function parseMsgContract(msg) {
  const json = fromUtf8(msg);

  return JSON.parse(json);
}
const replaceSlash = (text) => text.replace(/\//g, '%2F');

const encodeSlash = (text) => text.replace(/%2F/g, '/');

const groupMsg = (ArrMsg, size = 2) => {
  const link = [];
  for (let i = 0; i < Math.ceil(ArrMsg.length / size); i += 1) {
    link[i] = ArrMsg.slice(i * size, i * size + size);
  }
  return link;
};

const selectNetworkImg = (network) => {
  switch (network) {
    case 'bostrom':
      return cyberBostrom;
    case 'space-pussy':
      return cyberSpace;

    default:
      return customNetwork;
  }
};

const sha256 = (data) => {
  return new Uint8Array(new Sha256().update(data).digest());
};

function getDenomHash(path, baseDenom) {
  const parts = path.split('/');
  parts.push(baseDenom);
  const newPath = parts.slice().join('/');
  return `ibc/${Buffer.from(sha256(Buffer.from(newPath)))
    .toString('hex')
    .toUpperCase()}`;
}

function convertAmount(rawAmount, precision) {
  return new BigNumber(rawAmount)
    .shiftedBy(-precision)
    .dp(precision, BigNumber.ROUND_FLOOR)
    .toNumber();
}

function convertAmountReverce(rawAmount, precision) {
  return new BigNumber(rawAmount)
    .shiftedBy(precision)
    .dp(precision, BigNumber.ROUND_FLOOR)
    .toNumber();
}

function getDisplayAmount(rawAmount: number, precision: number): number {
  return parseFloat(
    new BigNumber(rawAmount)
      .shiftedBy(-precision)
      .dp(precision, BigNumber.ROUND_FLOOR)
      .toFixed(precision > 0 ? 3 : 0, BigNumber.ROUND_FLOOR)
  );
}

function getDisplayAmountReverce(rawAmount, precision) {
  return new BigNumber(rawAmount)
    .shiftedBy(precision)
    .dp(precision, BigNumber.ROUND_FLOOR)
    .toFixed(precision > 0 ? 3 : 0, BigNumber.ROUND_FLOOR);
}

function isNative(denom) {
  if (denom && denom.includes('ibc')) {
    return false;
  }
  return true;
}

const findDenomInTokenList = (baseDenom) => {
  let demonInfo = null;

  const findObj = tokenList.find((item) => item.coinMinimalDenom === baseDenom);

  if (findObj) {
    demonInfo = { ...findObj };
  }

  return demonInfo;
};

const findPoolDenomInArr = (
  baseDenom: string,
  dataPools: Pool[]
): Option<Pool> => {
  const findObj = dataPools.find((item) => item.poolCoinDenom === baseDenom);
  return findObj;
};

const getNowUtcTime = (): number => {
  const now = new Date();
  const utcTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  return utcTime.getTime();
};

export {
  formatNumber,
  asyncForEach,
  getDecimal,
  fromBech32,
  trimString,
  exponentialToDecimal,
  dhm,
  downloadObjectAsJson,
  isMobileTablet,
  coinDecimals,
  convertResources,
  timeSince,
  reduceBalances,
  makeTags,
  parseMsgContract,
  replaceSlash,
  encodeSlash,
  groupMsg,
  selectNetworkImg,
  getDenomHash,
  getDisplayAmount,
  getDisplayAmountReverce,
  convertAmount,
  convertAmountReverce,
  findDenomInTokenList,
  isNative,
  findPoolDenomInArr,
  getNowUtcTime,
};
