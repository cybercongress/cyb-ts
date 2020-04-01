export const setGolLoad = amount => {
  return {
    type: 'CHANGE_GOL_LOAD',
    payload: amount,
  };
};

export const setGolDelegation = amount => {
  return {
    type: 'CHANGE_GOL_DELEGATION',
    payload: amount,
  };
};

export const setGolLifeTime = amount => {
  return {
    type: 'CHANGE_GOL_LIFETIME',
    payload: amount,
  };
};

export const setGolTakeOff = amount => {
  return {
    type: 'CHANGE_GOL_TAKEOFF',
    payload: amount,
  };
};

export const setGolRelevance = amount => {
  return {
    type: 'CHANGE_GOL_RELEVANCE',
    payload: amount,
  };
};

export const setGolEuler4Rewards = amount => {
  return {
    type: 'CHANGE_GOL_EULER4REWARDS',
    payload: amount,
  };
};

export const setGolLoadCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_LOAD_PRIZE',
    payload: amount,
  };
};

export const setGolDelegationCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_DELEGATION_PRIZE',
    payload: amount,
  };
};

export const setGolLifeTimeCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_LIFETIME_PRIZE',
    payload: amount,
  };
};

export const setGolTakeOffCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_TAKEOFF_PRIZE',
    payload: amount,
  };
};

export const setGolRelevanceCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_RELEVANCE_PRIZE',
    payload: amount,
  };
};

export const setGolEuler4RewardsCurrentPrize = amount => {
  return {
    type: 'CHANGE_GOL_EULER4REWARDS_PRIZE',
    payload: amount,
  };
};
