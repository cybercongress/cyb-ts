import axios from 'axios';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import { CYBER, TAKEOFF, COSMOS } from '../config';

const {
  CYBER_NODE_URL,
  CYBER_NODE_URL_API,
  CYBER_NODE_URL_LCD,
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER,
} = CYBER;

const IPFS = require('ipfs-api');

const Unixfs = require('ipfs-unixfs');

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

export const initIpfs = async () => {
  if (ipfsApi) {
    return;
  }

  const ipfsConfig = await getIpfsConfig();

  ipfsApi = new IPFS(ipfsConfig);
};

const getIpfs = async () => {
  if (ipfsApi) {
    return ipfsApi;
  }

  await initIpfs();

  return ipfsApi;
};

export const getContentByCid = (cid, timeout) =>
  getIpfs().then(ipfs => {
    const timeoutPromise = () =>
      new Promise((resolve, reject) => {
        setTimeout(reject, timeout, 'ipfs get timeout');
      });

    const ipfsGetPromise = () =>
      new Promise((resolve, reject) => {
        ipfs.get(cid, (error, files) => {
          if (error) {
            reject(error);
          }

          const buf = files[0].content;

          resolve(buf.toString());
        });
      });

    return Promise.race([timeoutPromise(), ipfsGetPromise()]);
  });

export const formatNumber = (number, toFixed) => {
  let formatted = +number;

  if (toFixed) {
    formatted = +formatted.toFixed(toFixed);
  }
  // debugger;
  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

export const getIpfsHash = string =>
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

export const getString = string =>
  new Promise((resolve, reject) => {
    const unixFsFile = new Unixfs('file', Buffer.from(string));

    const buffer = unixFsFile.marshal();
    console.log(buffer);
    DAGNode.create(buffer, (err, dagNode) => {
      if (err) {
        reject(new Error('Cannot create ipfs DAGNode'));
      }

      DAGUtil.cid(dagNode, (error, cid) => {
        resolve(cid.toV1());
      });
    });
  });

export const search = async keywordHash =>
  axios({
    method: 'get',
    url: `${CYBER_NODE_URL}/api/search?cid=%22${keywordHash}%22&page=0&perPage=10`,
  }).then(response => (response.data.result ? response.data.result.cids : []));

export const getRankGrade = rank => {
  let from;
  let to;
  let value;

  switch (true) {
    case rank > 0.01:
      from = 0.01;
      to = 1;
      value = 1;
      break;
    case rank > 0.001:
      from = 0.001;
      to = 0.01;
      value = 2;
      break;
    case rank > 0.000001:
      from = 0.000001;
      to = 0.001;
      value = 3;
      break;
    case rank > 0.0000000001:
      from = 0.0000000001;
      to = 0.000001;
      value = 4;
      break;
    case rank > 0.000000000000001:
      from = 0.000000000000001;
      to = 0.0000000001;
      value = 5;
      break;
    case rank > 0.0000000000000000001:
      from = 0.0000000000000000001;
      to = 0.000000000000001;
      value = 6;
      break;
    case rank > 0:
      from = 0;
      to = 0.0000000000000000001;
      value = 7;
      break;
    default:
      from = 'n/a';
      to = 'n/a';
      value = 'n/a';
      break;
  }

  return {
    from,
    to,
    value,
  };
};

export const getStatistics = () =>
  new Promise(resolve => {
    const indexStatsPromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/index_stats`,
    }).then(response => response.data.result);

    const stakingPromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/staking/pool`,
    }).then(response => response.data.result);

    const bandwidthPricePromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/current_bandwidth_price`,
    }).then(response => response.data.result);

    const latestBlockPromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/block`,
    }).then(response => response.data.result);

    const supplyTotalPropsise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/supply/total`,
    }).then(response => response.data.result);

    Promise.all([
      indexStatsPromise,
      stakingPromise,
      bandwidthPricePromise,
      latestBlockPromise,
      supplyTotalPropsise,
    ]).then(
      ([indexStats, staking, bandwidthPrice, latestBlock, supplyTotal]) => {
        const response = {
          ...indexStats,
          bondedTokens: staking.bonded_tokens,
          bandwidthPrice: bandwidthPrice.price,
          txCount: 0,
          supplyTotal: supplyTotal[0].amount,
        };

        resolve(response);
      }
    );
  });

export const getValidators = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/validators`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getValidatorsUnbonding = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/validators?status=unbonding`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getValidatorsUnbonded = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/validators?status=unbonded`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const selfDelegationShares = async (
  delegatorAddress,
  operatorAddress
) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/delegators/${delegatorAddress}/delegations/${operatorAddress}`,
    });
    return response.data.result.shares;
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

export const getAccountBandwidth = async address => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/account_bandwidth?address="${address}"`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const statusNode = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/status`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getRelevance = perPage =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/top?page=0&perPage=${perPage || '50'}`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getBalance = async (address, node) => {
  try {
    const availablePromise = await axios({
      method: 'get',
      url: `${node || CYBER_NODE_URL_LCD}/bank/balances/${address}`,
    });

    const delegationsPromise = await axios({
      method: 'get',
      url: `${node ||
        CYBER_NODE_URL_LCD}/staking/delegators/${address}/delegations`,
    });

    const unbondingPromise = await axios({
      method: 'get',
      url: `${node ||
        CYBER_NODE_URL_LCD}/staking/delegators/${address}/unbonding_delegations`,
    });

    const rewardsPropsise = await axios({
      method: 'get',
      url: `${node ||
        CYBER_NODE_URL_LCD}/distribution/delegators/${address}/rewards`,
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

export const getTotalEUL = async data => {
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
        balance.total += Math.floor(parseFloat(delegation.balance.amount));
        balance.delegation += Math.floor(parseFloat(delegation.balance.amount));
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
    // const validatorAddress = getDelegator(account, 'cybervaloper');
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

export const getAmountATOM = data => {
  let amount = 0;
  for (let item = 0; item < data.length; item++) {
    if (amount <= TAKEOFF.ATOMsALL) {
      amount +=
        Number.parseInt(data[item].tx.value.msg[0].value.amount[0].amount) /
        COSMOS.DIVISOR_ATOM;
    } else {
      amount = TAKEOFF.ATOMsALL;
      break;
    }
  }
  return amount;
};

export const getBalanceWallet = address =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL_API}/account?address="${address}"`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getDrop = async address => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://io.cybernode.ai/ipfs_api/api/v0/dag/get?arg=bafyreifheyc6rhjhxenu3df3pwbxv5r6vb273szvwufjbly4m6rlv3jyni/${address}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getTxs = async txs => {
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

export const getValidatorsInfo = async address => {
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

export const getDistribution = async address => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/distribution/validators/${address}`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const keybaseCheck = async identity => {
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

export const keybaseAvatar = async identity => {
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

export const getDelegators = async validatorAddr => {
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

export const getRewards = async (delegatorAddr, validatorAddr) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTotalRewards = async delegatorAddr => {
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

export const getDelegations = async address => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/delegators/${address}/delegations`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getTotalSupply = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/supply/total`,
    });
    return response.data.result[0].amount;
  } catch (e) {
    console.log(e);
    return 0;
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
    return 0;
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
    return 0;
  }
};
