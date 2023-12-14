import axios from 'axios';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import Unixfs from 'ipfs-unixfs';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';

import * as config from '../config';

import { LinkType } from 'src/containers/ipfs/hooks/useGetDiscussion';
import { CyberClient } from '@cybercongress/cyber-js';
import { QueryDelegatorDelegationsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { CID_TWEET } from '../consts';

const { CYBER_NODE_URL_LCD, CYBER_GATEWAY } = config.CYBER;

const SEARCH_RESULT_TIMEOUT_MS = 10000;

export const formatNumber = (number, toFixed) => {
  let formatted = +number;

  if (toFixed) {
    formatted = +formatted.toFixed(toFixed);
  }

  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

export const getIpfsHash = (string: string) =>
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

/**
 * @deprecated use Apollo
 */
export const getGraphQLQuery = async (
  query,
  urlGraphql = config.CYBER.CYBER_INDEX_HTTPS
) => {
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

  if (response.data.errors) {
    throw response.data;
  }

  return response.data;
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

const getParamStaking = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/staking/parameters`,
    });
    return response.data.result;
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

enum Order {
  ASC = 'ORDER_BY_ASC',
  DESC = 'ORDER_BY_DESC',
}

const getLink = async (
  cid: string,
  type: LinkType = LinkType.from,
  { offset, limit, order = Order.DESC }
) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs`,
      params: {
        'pagination.offset': offset,
        'pagination.limit': limit,
        orderBy: Order.DESC,
        events: `cyberlink.particle${
          type === LinkType.to ? 'To' : 'From'
        }='${cid}'`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getFromLink = async (cid, offset, limit) => {
  return getLink(cid, LinkType.from, { offset, limit });
};

export const getToLink = async (cid, offset, limit) => {
  return getLink(cid, LinkType.to, { offset, limit });
};

export const getSendBySenderRecipient = async (
  address,
  offset = 0,
  limit = 5
) => {
  try {
    const { recipient, sender } = address;
    const response = await axios({
      method: 'get',
      url: `https://lcd.bostrom.cybernode.ai/cosmos/tx/v1beta1/txs?pagination.offset=${offset}&pagination.limit=${limit}&orderBy=ORDER_BY_DESC&events=message.action%3D%27%2Fcosmos.bank.v1beta1.MsgSend%27&events=transfer.sender%3D%27${sender}%27&events=transfer.recipient%3D%27${recipient}%27`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return undefined;
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
      url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=${CID_TWEET}&limit=1000000000`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
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

type PropsTx = {
  events: ReadonlyArray<{ key: string; value: string }>;
  pagination?: {
    limit: number;
    offset: number;
  };
  orderBy?: 'ORDER_BY_UNSPECIFIED' | 'ORDER_BY_ASC' | 'ORDER_BY_DESC';
};

// // TODO: add types
export async function getTransactions({
  events,
  pagination = { limit: 20, offset: 0 },
  orderBy = 'ORDER_BY_UNSPECIFIED',
}: PropsTx) {
  const { offset, limit } = pagination;
  return axios.get(`${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs`, {
    params: {
      'pagination.offset': offset,
      'pagination.limit': limit,
      orderBy,
      events: events.map((evn) => `${evn.key}='${evn.value}'`),
    },
    paramsSerializer: {
      indexes: null,
    },
  });
}

// export async function getCyberlinks(address) {
//   getTransactions({
//     events: [
//       "message.action='/cyber.graph.v1beta1.MsgCyberlink'",
//       "cyberlink.neuron=' + address",
//     ],
//   });
// }
export async function getCyberlinks(address) {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs?pagination.offset=0&pagination.limit=5&orderBy=ORDER_BY_ASC&events=message.action='/cyber.graph.v1beta1.MsgCyberlink'&events=cyberlink.neuron='${address}'`,
    });

    return response.data.pagination.total;
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
    // TODO: refactor this
    const response = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs?pagination.offset=0&pagination.limit=1&orderBy=ORDER_BY_ASC&events=cyberlink.particleTo%3D%27${cid}%27`,
    });

    const response2 = await axios({
      method: 'get',
      url: `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs?pagination.offset=0&pagination.limit=1&orderBy=ORDER_BY_ASC&events=cyberlink.particleFrom%3D%27${cid}%27`,
    });

    const h1 = Number(response.data.tx_responses?.[0]?.height || 0);
    const h2 = Number(response2.data.tx_responses?.[0]?.height || 0);

    if (h1 === 0) {
      return response2.data;
    } else if (h2 === 0) {
      return response.data;
    }

    return h1 < h2 ? response.data : response2.data;
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

// export const getAvatarIpfs = async (cid, ipfs) => {
//   try {
//     // TODO: ipfs refactor
//     const response = await getIPFSContent(cid, ipfs);
//     console.log('--------getAvatarIpfs', cid, response);
//     if (response?.result) {
//       // const rawData = await getResponseResult(response.result);
//       const details = await parseArrayLikeToDetails(
//         response.result,
//         response.meta.mime,
//         cid
//       );
//       if (details.type === 'image') {
//         return details.content;
//       }

//       return undefined;
//     }

//     return undefined;
//   } catch (error) {
//     return undefined;
//   }
// };

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

export const searchByHash = async (
  client,
  hash,
  page,
  options = { storeToCozo: false, callback: undefined }
) => {
  try {
    const responseSearchResults = await client.search(hash, page);

    // TODO: refactor ???

    const results = responseSearchResults.result ? responseSearchResults : [];

    if (
      page === 0 &&
      options.callback &&
      responseSearchResults.pagination.total
    ) {
      options.callback(responseSearchResults.pagination.total);
    }
    if (options.storeToCozo) {
      console.log('-----searc', hash, responseSearchResults);
      backgroundWorkerInstance.importApi.importParticle(hash);
      backgroundWorkerInstance.importApi.importCyberlinks(
        responseSearchResults.result.map((item) => ({
          from: hash,
          to: item.particle,
          neuron: '',
          timestamp: 0,
        }))
      );
    }
    return results;
  } catch (error) {
    // TODO: handle
    console.error(error);
    return [];
  }
};

export const getDelegatorDelegations = async (
  client: CyberClient,
  addressBech32: string
): Promise<DelegationResponse[]> => {
  let nextKey;
  const delegationData: DelegationResponse[] = [];

  let done = false;
  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const responsedelegatorDelegations = (await client.delegatorDelegations(
      addressBech32,
      nextKey
    )) as QueryDelegatorDelegationsResponse;

    delegationData.push(...responsedelegatorDelegations.delegationResponses);

    const key = responsedelegatorDelegations?.pagination?.nextKey;

    if (key) {
      nextKey = key;
    } else {
      done = true;
    }
  }

  return delegationData;
};
