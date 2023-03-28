import axios from 'axios';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import Unixfs from 'ipfs-unixfs';
import FileType from 'file-type';
import * as config from '../config';

import { getContentByCid } from '../utils-ipfs';

// const IPFS = require('ipfs-api');

const { CYBER_NODE_URL_API, CYBER_NODE_URL_LCD, CYBER_GATEWAY } = config.CYBER;

const SEARCH_RESULT_TIMEOUT_MS = 10000;

let ipfsApi;

const getIpfsConfig = async () => {
  if (window.getIpfsConfig) {
    return window.getIpfsConfig();
  }

  return {
    host: 'localhost',
    port: 5001,
    protocol: 'http',
  };
};

export const formatNumber = (number, toFixed) => {
  let formatted = +number;

  if (toFixed) {
    formatted = +formatted.toFixed(toFixed);
  }
  // debugger;
  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

export const getPin = async (node, content) => {
  let cid;
  if (node) {
    if (typeof content === 'string') {
      cid = await node.add(new Buffer(content), { pin: true });
    } else {
      cid = await node.add(content, { pin: true });
    }
    console.warn('content', content, 'cid', cid);
    return cid.path;
  }
};

export const getIpfsHash = (string) =>
  new Promise((resolve, reject) => {
    const unixFsFile = new Unixfs('file', Buffer.from(string));

    const buffer = unixFsFile.marshal();
    DAGNode.create(buffer, (err, dagNode) => {
      if (err) {
        reject(new Error('Cannot create ipfs DAGNode'));
      }

      DAGUtil.cid(dagNode, (error, cid) => {
        resolve(cid.toBaseEncodedString());
      });
    });
  });

export const getRankGrade = (rank) => {
  let from;
  let to;
  let value;

  if (rank > 0.00000276) {
    from = 0.00000276;
    to = 0.01;
    value = 1;
  } else if (rank > 0.00000254879356777504 && rank <= 0.00000276) {
    from = 0.00000254879356777504;
    to = 0.00000276;
    value = 2;
  } else if (rank > 0.00000233758713555007 && rank <= 0.00000254879356777504) {
    from = 0.00000233758713555007;
    to = 0.00000254879356777504;
    value = 3;
  } else if (rank > 0.00000191517427110014 && rank <= 0.00000233758713555007) {
    from = 0.00000191517427110014;
    to = 0.00000233758713555007;
    value = 4;
  } else if (rank > 0.00000128155497442525 && rank <= 0.00000191517427110014) {
    from = 0.00000128155497442525;
    to = 0.00000191517427110014;
    value = 5;
  } else if (rank > 0.00000022552281330043 && rank <= 0.00000128155497442525) {
    from = 0.00000022552281330043;
    to = 0.00000128155497442525;
    value = 6;
  } else if (rank > 0 && rank <= 0.00000022552281330043) {
    from = 0;
    to = 0.00000022552281330043;
    value = 7;
  } else {
    from = 'n/a';
    to = 'n/a';
    value = 'n/a';
  }

  return {
    from,
    to,
    value,
  };
};

export const selfDelegationShares = async (
  delegatorAddress,
  operatorAddress
) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/delegators/${delegatorAddress}/delegations/${operatorAddress}`,
    });
    return response.data.result.balance.amount;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const stakingPool = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/pool`,
    });

    return response.data.result;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getAccountBandwidth = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/bandwidth/neuron/${address}`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const statusNode = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/status`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getRelevance = async (page = 0, limit = 50) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/rank/top?page=${page}&limit=${limit}`,
    });
    return response.data.result;
  } catch (error) {
    return {};
  }
};

export const getBalance = async (address, node) => {
  try {
    const availablePromise = await axios({
      method: 'get',
      url: `${node || CYBER_NODE_URL_LCD}/bank/balances/${address}`,
    });

    const delegationsPromise = await axios({
      method: 'get',
      url: `${
        node || CYBER_NODE_URL_LCD
      }/staking/delegators/${address}/delegations`,
    });

    const unbondingPromise = await axios({
      method: 'get',
      url: `${
        node || CYBER_NODE_URL_LCD
      }/staking/delegators/${address}/unbonding_delegations`,
    });

    const rewardsPropsise = await axios({
      method: 'get',
      url: `${
        node || CYBER_NODE_URL_LCD
      }/distribution/delegators/${address}/rewards`,
    });

    const response = {
      available: availablePromise.data.result[0],
      delegations: delegationsPromise.data.result,
      unbonding: unbondingPromise.data.result,
      rewards:
        rewardsPropsise.data.result.total !== null
          ? rewardsPropsise.data.result.total[0]
          : 0,
    };

    return response;
  } catch (e) {
    console.log(e);
    return {
      available: 0,
      delegations: 0,
      unbonding: 0,
      rewards: 0,
    };
  }
};

export const getTotalEUL = (data) => {
  const balance = {
    available: 0,
    delegation: 0,
    unbonding: 0,
    rewards: 0,
    total: 0,
  };

  if (data) {
    if (data.available && data.available !== 0) {
      balance.total += Math.floor(parseFloat(data.available.amount));
      balance.available += Math.floor(parseFloat(data.available.amount));
    }

    if (
      data.delegations &&
      data.delegations.length > 0 &&
      data.delegations !== 0
    ) {
      data.delegations.forEach((delegation, i) => {
        if (delegation.balance.amount) {
          balance.total += Math.floor(parseFloat(delegation.balance.amount));
          balance.delegation += Math.floor(
            parseFloat(delegation.balance.amount)
          );
        } else {
          balance.total += Math.floor(parseFloat(delegation.balance));
          balance.delegation += Math.floor(parseFloat(delegation.balance));
        }
      });
    }

    if (data.unbonding && data.unbonding.length > 0 && data.unbonding !== 0) {
      data.unbonding.forEach((unbond, i) => {
        unbond.entries.forEach((entry, j) => {
          balance.unbonding += Math.floor(parseFloat(entry.balance));
          balance.total += Math.floor(parseFloat(entry.balance));
        });
      });
    }

    if (data.rewards && data.rewards !== 0) {
      balance.total += Math.floor(parseFloat(data.rewards.amount));
      balance.rewards += Math.floor(parseFloat(data.rewards.amount));
    }

    if (data.val_commission && data.val_commission.length > 0) {
      balance.commission = Math.floor(
        parseFloat(data.val_commission[0].amount)
      );
      balance.total += Math.floor(parseFloat(data.val_commission[0].amount));
    }
    // const validatorAddress = fromBech32(account, 'cybervaloper');
    // const resultGetDistribution = await getDistribution(validatorAddress);
    // if (resultGetDistribution) {
    //   balance.commission += Math.floor(
    //     parseFloat(resultGetDistribution.val_commission[0].amount)
    //   );
    //   balance.total += Math.floor(
    //     parseFloat(resultGetDistribution.val_commission[0].amount)
    //   );;
    // }
  }
  return balance;
};

export const getAmountATOM = (data) => {
  let amount = 0;
  for (let item = 0; item < data.length; item++) {
    if (amount <= config.TAKEOFF.ATOMsALL) {
      amount +=
        Number.parseInt(data[item].tx.value.msg[0].value.amount[0].amount) /
        config.COSMOS.DIVISOR_ATOM;
    } else {
      amount = config.TAKEOFF.ATOMsALL;
      break;
    }
  }
  return amount;
};

export const getBalanceWallet = (address) =>
  new Promise((resolve) =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/account?address="${address}"`,
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((e) => {})
  );

export const getTxs = async (txs) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs/${txs}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getValidatorsInfo = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/validators/${address}`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const keybaseCheck = async (identity) => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=basics`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const keybaseAvatar = async (identity) => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getDelegators = async (validatorAddr) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/validators/${validatorAddr}/delegations`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTotalRewards = async (delegatorAddr) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/distribution/delegators/${delegatorAddr}/rewards`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getCurrentBandwidthPrice = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/current_bandwidth_price`,
    });
    return response.data.result.price;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getIndexStats = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/index_stats`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getGraphQLQuery = async (
  query,
  urlGraphql = config.CYBER.CYBER_INDEX_HTTPS
) => {
  try {
    const body = JSON.stringify({
      query,
    });
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios({
      method: 'post',
      url: urlGraphql,
      headers,
      data: body,
    });
    return response.data.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSendTxToTakeoff = async (sender, recipient) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${config.COSMOS.GAIA_NODE_URL_LSD}/txs?message.action=send&message.sender=${sender}&transfer.recipient=${recipient}&limit=1000000000`,
    });
    return response.data.txs;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getParamSlashing = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/slashing/parameters`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamDistribution = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/distribution/parameters`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamBandwidth = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/bandwidth/parameters`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamGov = async () => {
  try {
    const responseGovDeposit = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/gov/parameters/deposit`,
    });

    const responseGovTallying = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/gov/parameters/tallying`,
    });

    const responseGovVoting = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/gov/parameters/voting`,
    });

    const response = {
      deposit: responseGovDeposit.data.result,
      voting: responseGovTallying.data.result,
      tallying: responseGovVoting.data.result,
    };

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamRank = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/rank/parameters`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamInlfation = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/minting/parameters`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamResources = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cyber/resources/v1beta1/resources/params`,
    });
    return response.data.params;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamLiquidity = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/liquidity/v1beta1/params`,
    });
    return response.data.params;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamGrid = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cyber/grid/v1beta1/grid/params`,
    });
    return response.data.params;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamDmn = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cyber/dmn/v1beta1/dmn/params`,
    });
    return response.data.params;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getParamNetwork = async (address, node) => {
  try {
    let staking = null;
    let slashing = null;
    let distribution = null;
    let bandwidth = null;
    let gov = null;
    let rank = null;
    let mint = null;
    let resources = null;
    let liquidity = null;
    let grid = null;
    let dmn = null;

    const dataStaking = await getParamStaking();
    if (dataStaking !== null) {
      staking = dataStaking;
    }
    const dataSlashing = await getParamSlashing();
    if (dataSlashing !== null) {
      slashing = dataSlashing;
    }
    const dataDistribution = await getParamDistribution();
    if (dataDistribution !== null) {
      distribution = dataDistribution;
    }
    const dataGov = await getParamGov();
    if (dataGov !== null) {
      gov = dataGov;
    }
    const dataBandwidth = await getParamBandwidth();
    if (dataBandwidth !== null) {
      bandwidth = dataBandwidth;
    }

    const dataRank = await getParamRank();
    if (dataRank !== null) {
      rank = dataRank;
    }

    const dataInlfation = await getParamInlfation();
    if (dataInlfation !== null) {
      mint = dataInlfation;
    }

    const dataResources = await getParamResources();
    if (dataResources !== null) {
      resources = dataResources;
    }

    const dataLiquidity = await getParamLiquidity();
    if (dataLiquidity !== null) {
      liquidity = dataLiquidity;
    }

    const dataGrid = await getParamGrid();
    if (dataGrid !== null) {
      grid = dataGrid;
    }

    const dataDmn = await getParamDmn();
    if (dataDmn !== null) {
      dmn = dataDmn;
    }

    const response = {
      staking,
      slashing,
      distribution,
      bandwidth,
      gov,
      rank,
      mint,
      resources,
      liquidity,
      grid,
      dmn,
    };

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getInlfation = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/minting/inflation`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getcommunityPool = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/distribution/community_pool`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getImportLink = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://io.cybernode.ai/api/v0/dag/get?arg=bafyreibnn7bfilbmkrxm2rwk5fe6qzzdvm2xen34cjdktdoex4uylb76z4/${address}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getFromLink = async (cid) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleTo=${cid}&limit=1000000000`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getToLink = async (cid) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleFrom=${cid}&limit=1000000000`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getFollows = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx&limit=1000000000`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTweet = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx&limit=1000000000`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getContent = async (cid, timeout = SEARCH_RESULT_TIMEOUT_MS) => {
  // const timeoutPromise = () =>
  //   new Promise((reject) => {
  //     timerId = setTimeout(reject, timeout);
  //   });

  const ipfsGetPromise = () =>
    new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: `${CYBER_GATEWAY}/ipfs/${cid}`,
      }).then((response) => {
        // clearTimeout(timerId);
        resolve(response.data);
      });
    });
  return Promise.race([ipfsGetPromise()]);
};

export const chekFollow = async (address, addressFollowHash) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx&cyberlink.particleTo=${addressFollowHash}&limit=1000000000`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAvatar = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=Qmf89bXkJH9jw4uaLkHmZkxQ51qGKfUPtAMxA8rTwBrmTs&limit=1000000000`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFollowers = async (addressHash) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleFrom=QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx&cyberlink.particleTo=${addressHash}&limit=1000000000`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCreator = async (cid) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs?pagination.offset=0&pagination.limit=5&orderBy=ORDER_BY_ASC&events=cyberlink.particleTo%3D%27${cid}%27`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const authAccounts = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/auth/accounts/${address}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const convertAvatarImg = async (data) => {
  let img = null;

  const dataFileType = await FileType.fromBuffer(data);
  console.log(`dataFileType`, dataFileType);

  const base64 = btoa(
    new Uint8Array(data).reduce(
      (dataR, byte) => dataR + String.fromCharCode(byte),
      ''
    )
  );

  const dataBase64 = uint8ArrayToAsciiString(data, 'base64');
  console.log(`base64`, base64);

  if (dataFileType !== undefined) {
    const { mime } = dataFileType;
    if (mime.indexOf('image') !== -1) {
      // const dataBase64 = data.toString('base64');
      const file = `data:${mime};base64,${dataBase64}`;
      return file;
    }
  }

  if (isSvg(data)) {
    const svg = `data:image/svg+xml;base64,${uint8ArrayToAsciiString(
      dataBase64,
      'base64'
    )}`;
    img = svg;
  } else {
    img = data;
  }

  return img;
};

const resolveContentIpfs = async (data) => {
  let mime;
  const dataFileType = await FileType.fromBuffer(data);
  if (dataFileType !== undefined) {
    mime = dataFileType.mime;
    if (mime.indexOf('image') !== -1) {
      // const dataBase64 = data.toString('base64');
      const dataBase64 = uint8ArrayToAsciiString(data, 'base64');
      const file = `data:${mime};base64,${dataBase64}`;
      return file;
    }
  }
  const dataBase64 = uint8ArrayToAsciiString(data);
  // console.log(`dataBase64`, dataBase64);
  if (isSvg(dataBase64)) {
    const svg = `data:image/svg+xml;base64,${uint8ArrayToAsciiString(
      data,
      'base64'
    )}`;
    return svg;
  }
  return null;
};

const generateMeta = (responseDag) => {
  const meta = {
    type: 'file',
    size: 0,
    blockSizes: [],
    data: '',
  };

  const linksCid = [];
  if (responseDag.value.Links && responseDag.value.Links.length > 0) {
    responseDag.value.Links.forEach((item, index) => {
      if (item.Name.length > 0) {
        linksCid.push({ name: item.Name, size: item.Tsize });
      } else {
        linksCid.push(item.Tsize);
      }
    });
  }
  meta.size = responseDag.value.size;
  meta.blockSizes = linksCid;

  return meta;
};

export const getAvatarIpfs = async (cid, ipfs) => {
  const response = await getContentByCid(ipfs, cid);
  if (response !== undefined) {
    const responseResolve = await resolveContentIpfs(response.data);
    return responseResolve;
  }

  return null;
};

export const getIpfsGatway = async (
  cid,
  type = 'json',
  userGateway = config.CYBER.CYBER_GATEWAY
) => {
  try {
    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 1000 * 60 * 1); // 1 min

    const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
      signal: abortController.signal,
      responseType: type,
    });

    return response.data;
  } catch (error) {
    console.log('error getIpfsGatway', error);
    return null;
  }
};

const getPinsCidPost = async (cid) => {
  console.log(`getPinsCidPost`);
  try {
    const response = await axios({
      method: 'post',
      url: `https://io.cybernode.ai/pins/${cid}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPinsCidGet = async (cid) => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://io.cybernode.ai/pins/${cid}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const addFileToCluster = async (cid, file) => {
  console.log(`addFileToCluster`);
  let dataFile = null;
  if (cid === file) {
    const responseGetPinsCidPost = await getPinsCidPost(cid);
    return responseGetPinsCidPost;
  }

  if (file instanceof Blob) {
    console.log(`Blob`);
    dataFile = file;
  } else if (typeof file === 'string') {
    dataFile = new File([file], 'file.txt');
  } else if (file.name && file.size < 8 * 10 ** 6) {
    dataFile = new File([file], file.name);
  }

  if (dataFile !== null) {
    const formData = new FormData();
    formData.append('file', dataFile);
    try {
      const response = await axios({
        method: 'post',
        url: 'https://io.cybernode.ai/add',
        data: formData,
      });
      return response;
    } catch (error) {
      const responseGetPinsCidPost = await getPinsCidPost(cid);
      return responseGetPinsCidPost;
    }
  } else {
    const responseGetPinsCidPost = await getPinsCidPost(cid);
    return responseGetPinsCidPost;
  }
};

export const getPinsCid = async (cid, file) => {
  try {
    const responseGetPinsCidGet = await getPinsCidGet(cid);
    if (
      responseGetPinsCidGet.peer_map &&
      Object.keys(responseGetPinsCidGet.peer_map).length > 0
    ) {
      const { peer_map: peerMap } = responseGetPinsCidGet;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in peerMap) {
        if (Object.hasOwnProperty.call(peerMap, key)) {
          const element = peerMap[key];
          if (element.status !== 'unpinned') {
            return null;
          }
        }
      }

      if (file !== undefined) {
        const responseGetPinsCidPost = await addFileToCluster(cid, file);
        return responseGetPinsCidPost;
      }
      const responseGetPinsCidPost = await getPinsCidPost(cid);
      return responseGetPinsCidPost;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// Access-Control-Allow-Origin
export const getCredit = async (address) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const fromData = {
      denom: 'boot',
      address,
    };
    const response = await axios({
      method: 'post',
      // url: 'http://localhost:8000/credit',
      url: 'https://titan.cybernode.ai/credit',
      headers,
      data: JSON.stringify(fromData),
    });

    return response;
  } catch (error) {
    return null;
  }
};

export const getDenomTraces = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/ibc/apps/transfer/v1/denom_traces`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
