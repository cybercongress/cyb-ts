import {
  getAccountBandwidth,
  getIndexStats,
  getValidatorsInfo,
  stakingPool,
} from '../search/utils';

export const getLoad = async address => {
  let karma = 0;
  let sumKarma = 0;
  let load = 0;

  const responseAccountBandwidth = await getAccountBandwidth(address);
  const responseIndexStats = await getIndexStats();

  if (responseAccountBandwidth !== null && responseIndexStats !== null) {
    karma = responseAccountBandwidth.karma;
    // sumKarma = responseIndexStats.totalKarma;
    sumKarma = responseIndexStats.karmaAll;
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
