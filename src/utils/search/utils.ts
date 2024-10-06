import axios from 'axios';

import { CyberClient } from '@cybercongress/cyber-js';
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { OrderBy } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { LCD_URL } from 'src/constants/config';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { LinksType, LinksTypeFilter } from 'src/containers/Search/types';
import { getTransactions } from 'src/services/transactions/lcd';
import { ParticleCid } from 'src/types/base';
import { getIpfsHash } from '../ipfs/helpers';
import { encodeSlash } from '../utils';

export const formatNumber = (number, toFixed) => {
  let formatted = +number;

  if (toFixed) {
    formatted = +formatted.toFixed(toFixed);
  }

  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

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
      url: `${LCD_URL}/staking/delegators/${delegatorAddress}/delegations/${operatorAddress}`,
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
      url: `${LCD_URL}/staking/pool`,
    });

    return response.data.result;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getRelevance = async (page = 0, limit = 50) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/cyber/rank/v1beta1/rank/top`,
      params: {
        'pagination.page': page,
        'pagination.perPage': limit,
      },
    });
    return response.data;
  } catch (error) {
    return {};
  }
};

export const getTxs = async (txs: string) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/cosmos/tx/v1beta1/txs/${txs}`,
    });

    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getValidatorsInfo = async (address: string) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/staking/validators/${address}`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const keybaseCheck = async (identity: string) => {
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

export const keybaseAvatar = async (identity: string) => {
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

export const getDelegators = async (validatorAddr: string) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/staking/validators/${validatorAddr}/delegations`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParamSlashing = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/slashing/parameters`,
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
      url: `${LCD_URL}/distribution/parameters`,
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
      url: `${LCD_URL}/bandwidth/parameters`,
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
      url: `${LCD_URL}/gov/parameters/deposit`,
    });

    const responseGovTallying = await axios({
      method: 'get',
      url: `${LCD_URL}/gov/parameters/tallying`,
    });

    const responseGovVoting = await axios({
      method: 'get',
      url: `${LCD_URL}/gov/parameters/voting`,
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
      url: `${LCD_URL}/rank/parameters`,
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
      url: `${LCD_URL}/minting/parameters`,
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
      url: `${LCD_URL}/cyber/resources/v1beta1/resources/params`,
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
      url: `${LCD_URL}/staking/parameters`,
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
      url: `${LCD_URL}/cosmos/liquidity/v1beta1/params`,
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
      url: `${LCD_URL}/cyber/grid/v1beta1/grid/params`,
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
      url: `${LCD_URL}/cyber/dmn/v1beta1/dmn/params`,
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

const getLink = async (
  cid: string,
  type: LinksType = LinksTypeFilter.from,
  { offset, limit, order = OrderBy.ORDER_BY_DESC }: any
) => {
  try {
    const response = await getTransactions({
      events: [
        {
          key: `cyberlink.particle${type === LinksTypeFilter.to ? 'To' : 'From'
            }`,
          value: cid,
        },
      ],
      pagination: {
        limit,
        offset,
      },
      orderBy: order,
    });

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getFromLink = async (cid, offset, limit) => {
  return getLink(cid, LinksTypeFilter.from, { offset, limit });
};

export const getToLink = async (cid, offset, limit) => {
  return getLink(cid, LinksTypeFilter.to, { offset, limit });
};

export const getSendBySenderRecipient = async (
  address,
  offset = 0,
  limit = 5
) => {
  try {
    const { recipient, sender } = address;

    const response = await getTransactions({
      events: [
        { key: 'message.action', value: '/cosmos.bank.v1beta1.MsgSend' },
        { key: 'transfer.sender', value: sender },
        { key: 'transfer.recipient', value: recipient },
      ],
      pagination: { limit, offset },
      orderBy: OrderBy.ORDER_BY_DESC,
    });

    return response;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getFollows = async (address) => {
  try {
    const response = await getTransactions({
      events: [
        { key: 'cyberlink.particleFrom', value: CID_FOLLOW },
        { key: 'cyberlink.neuron', value: address },
      ],
      pagination: { limit: 1000000000 },
    });

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTweet = async (address) => {
  try {
    const response = await getTransactions({
      events: [
        { key: 'cyberlink.particleFrom', value: CID_TWEET },
        { key: 'cyberlink.neuron', value: address },
      ],
      pagination: { limit: 1000000000 },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const chekFollow = async (address, addressFollowHash) => {
  try {
    const response = await getTransactions({
      events: [
        { key: 'cyberlink.particleFrom', value: CID_FOLLOW },
        { key: 'cyberlink.neuron', value: address },
        { key: 'cyberlink.particleTo', value: addressFollowHash },
      ],
      pagination: { limit: 1000000000 },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function getCyberlinksTotal(address: string) {
  try {
    const response = await getTransactions({
      events: [
        { key: 'message.action', value: '/cyber.graph.v1beta1.MsgCyberlink' },
        { key: 'cyberlink.neuron', value: address },
      ],
      pagination: { limit: 5, offset: 0 },
    });

    return response?.pagination?.total;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export const getFollowers = async (addressHash) => {
  try {
    const response = await getTransactions({
      events: [
        {
          key: 'cyberlink.particleFrom',
          value: CID_FOLLOW,
        },
        {
          key: 'cyberlink.particleTo',
          value: addressHash,
        },
      ],
      pagination: {
        limit: 1000000000,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCreator = async (cid) => {
  try {
    // TODO: refactor this
    const response = await getTransactions({
      events: [
        {
          key: 'cyberlink.particleTo',
          value: cid,
        },
      ],
      pagination: {
        limit: 1,
        offset: 0,
      },
    });

    const response2 = await getTransactions({
      events: [
        {
          key: 'cyberlink.particleFrom',
          value: cid,
        },
      ],
      pagination: {
        limit: 1,
        offset: 0,
      },
    });

    const h1 = Number(response.txResponses?.[0]?.height || 0);
    const h2 = Number(response2.txResponses?.[0]?.height || 0);

    if (h1 === 0) {
      return response2;
    }
    if (h2 === 0) {
      return response;
    }

    return h1 < h2 ? response : response2;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const authAccounts = async (address) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/cosmos/auth/v1beta1/accounts/${address}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
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

export const getSearchQuery = async (query: ParticleCid | string) =>
  query.match(PATTERN_IPFS_HASH) ? query : getIpfsHash(encodeSlash(query));

export const searchByHash = async (
  client: CyberClient,
  hash: string,
  page: number
) => {
  try {
    const results = await client.search(hash, page);

    return results;
  } catch (error) {
    // TODO: handle
    console.error(error);
    return undefined;
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
    const responsedelegatorDelegations = await client.delegatorDelegations(
      addressBech32,
      nextKey
    );

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
