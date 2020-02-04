import axios from 'axios';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import { CYBER, TAKEOFF, COSMOS } from '../config';

const { CYBER_NODE_URL, BECH32_PREFIX_ACC_ADDR_CYBERVALOPER } = CYBER;

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
      url: `${CYBER_NODE_URL}/api/index_stats`,
    }).then(response => response.data.result);

    const stakingPromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/api/staking/pool`,
    }).then(response => response.data.result);

    const bandwidthPricePromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/api/current_bandwidth_price`,
    }).then(response => response.data.result);

    const latestBlockPromise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/api/block`,
    }).then(response => response.data.result);

    const supplyTotalPropsise = axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/supply/total`,
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
          txCount: latestBlock.block_meta.header.total_txs,
          supplyTotal: supplyTotal[0].amount,
        };

        resolve(response);
      }
    );
  });

export const getValidators = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/validators`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getValidatorsUnbonding = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/validators?status=unbonding`,
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
      url: `${CYBER_NODE_URL}/lcd/staking/validators?status=unbonded`,
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
      url: `${CYBER_NODE_URL}/lcd/staking/delegators/${delegatorAddress}/delegations/${operatorAddress}`,
    });
    return response.data.result.shares;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const stakingPool = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/pool`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getRankValidators = address =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/api/account_bandwidth?address="${address}"`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const statusNode = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/api/status`,
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
      url: `${CYBER_NODE_URL}/api/top?page=0&perPage=${perPage || '50'}`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

// export const getBalance = address =>
//   new Promise(resolve => {
//     const availablePromise = axios({
//       method: 'get',
//       url: `${CYBER_NODE_URL}/lcd/bank/balances/${address}`,
//     }).then(response => response.data.result);

//     const delegationsPromise = axios({
//       method: 'get',
//       url: `${CYBER_NODE_URL}/lcd/staking/delegators/${address}/delegations`,
//     }).then(response => response.data.result);

//     const unbondingPromise = axios({
//       method: 'get',
//       url: `${CYBER_NODE_URL}/lcd/staking/delegators/${address}/unbonding_delegations`,
//     }).then(response => response.data.result);

//     const rewardsPropsise = axios({
//       method: 'get',
//       url: `${CYBER_NODE_URL}/lcd/distribution/delegators/${address}/rewards`,
//     }).then(response => response.data.result);

//     Promise.all([
//       availablePromise,
//       delegationsPromise,
//       unbondingPromise,
//       rewardsPropsise,
//     ])
//       .then(([available, delegations, unbonding, rewards]) => {
//         const response = {
//           available: available[0],
//           delegations,
//           unbonding,
//           rewards: rewards.total[0],
//         };

//         resolve(response);
//       })
//       .catch(e => {});
//   });

export const getBalance = async address => {
  try {
    const availablePromise = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/bank/balances/${address}`,
    });

    const delegationsPromise = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/delegators/${address}/delegations`,
    });

    const unbondingPromise = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/delegators/${address}/unbonding_delegations`,
    });

    const rewardsPropsise = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/distribution/delegators/${address}/rewards`,
    });

    const response = {
      available: availablePromise.data.result[0],
      delegations: delegationsPromise.data.result,
      unbonding: unbondingPromise.data.result,
      rewards: rewardsPropsise.data.result.total[0],
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
        balance.total += Math.floor(parseFloat(delegation.balance));
        balance.delegation += Math.floor(parseFloat(delegation.balance));
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
      url: `${CYBER_NODE_URL}/api/account?address="${address}"`,
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
      url: `https://herzner1.cybernode.ai/ipfs/api/v0/dag/get?arg=bafyreieyaqxuslbbakpr5gqe2wdlb7igdffeosqwznqlzrbjxf2xovnqua/${address}`,
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
      url: `${CYBER_NODE_URL}/lcd/txs/${txs}`,
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
      url: `${CYBER_NODE_URL}/lcd/staking/validators/${address}`,
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
      url: `${CYBER_NODE_URL}/lcd/distribution/validators/${address}`,
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

export const getDelegations = async validatorAddr => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL}/lcd/staking/validators/${validatorAddr}/delegations`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
