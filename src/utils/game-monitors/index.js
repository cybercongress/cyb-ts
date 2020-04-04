import {
  getAccountBandwidth,
  getIndexStats,
  getValidatorsInfo,
  stakingPool,
  getDrop,
  getAmountATOM,
  getSendTxToTakeoff,
} from '../search/utils';
import { getDelegator } from '../utils';
import { COSMOS } from '../config';

export const getLoad = async address => {
  let karma = 0;
  let sumKarma = 0;
  let load = 0;

  const responseAccountBandwidth = await getAccountBandwidth(address);
  const responseIndexStats = await getIndexStats();

  if (responseAccountBandwidth !== null && responseIndexStats !== null) {
    karma = responseAccountBandwidth.karma;
    // sumKarma = responseIndexStats.totalKarma;
    sumKarma = responseIndexStats.totalKarma;
    load = parseFloat(karma) / parseFloat(sumKarma);
    console.log('load', load);
  }
  return load;
};

export const getDelegation = async address => {
  let delegation = 0;
  let currentValidatorStakedTokens = 0;
  let allBondedTokens = 0;

  const responseGetValidatorsInfo = await getValidatorsInfo(address);
  if (responseGetValidatorsInfo === null) {
    return delegation;
  }
  const responseStakingPool = await stakingPool();

  if (responseStakingPool !== 0) {
    allBondedTokens = responseStakingPool.bonded_tokens;
    currentValidatorStakedTokens = responseGetValidatorsInfo.tokens;
    delegation =
      parseFloat(currentValidatorStakedTokens) / parseFloat(allBondedTokens);
  }
  return delegation;
};

export const getLifetime = async data => {
  let lifetime = 0;

  if (data !== null) {
    if (data.preCommit !== 0) {
      lifetime = parseFloat(data.preCommit) / parseFloat(data.block);
    }
  }

  return lifetime;
};

export const getRewards = async address => {
  let rewards = 0;

  const dataGetDrop = await getDrop(address);

  if (dataGetDrop !== 0) {
    rewards = dataGetDrop.gift;
  }

  return rewards;
};

export const getRelevance = async (dataRelevance, dataQ) => {
  let relevance = 0;
  const arrCof = [
    1,
    1.5,
    1.83333333,
    2.08333333,
    2.28333333,
    2.45,
    2.59285714,
    2.71785714,
    2.82896825,
    2.92896825,
  ];
  const rankAggr = dataRelevance.relevance_aggregate.aggregate.sum.rank;

  dataRelevance.rewards_view.forEach((item, index) => {
    let weght = 0;
    let tempShare = 0;
    const indexArrCof = dataQ.linkages_view[index].linkages;

    weght = parseFloat(item.rank) / parseFloat(rankAggr);

    const order = parseFloat(item.order_number) / arrCof[indexArrCof];

    tempShare = weght * order;

    relevance += tempShare;
  });
  return relevance;
};

export const getTakeoff = async (sender, takeoffDonations) => {
  let amount = 0;
  let takeoff = 0;

  const cosmosAddress = getDelegator(sender, 'cosmos');
  const data = await getSendTxToTakeoff(cosmosAddress, COSMOS.ADDR_FUNDING);

  if (Object.keys(data).length > 0) {
    amount = getAmountATOM(data);
    takeoff = parseFloat(amount) / parseFloat(takeoffDonations);
  }

  return takeoff;
};
