export const setGolLoad = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_LOAD',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};

export const setGolDelegation = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_DELEGATION',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};

export const setGolLifeTime = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_LIFETIME',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};

export const setGolTakeOff = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_TAKEOFF',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};

export const setGolRelevance = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_RELEVANCE',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};

export const setGolEuler4Rewards = (amount, prize) => {
  return {
    type: 'CHANGE_GOL_EULER4REWARDS',
    currentPrize: prize,
    cybAbsolute: amount,
  };
};
