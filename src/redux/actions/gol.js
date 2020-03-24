export const setGolLoad = ipfs => {
  return {
    type: 'CHANGE_GOL_LOAD',
    payload: ipfs,
  };
};

export const setGolDelegation = status => {
  return {
    type: 'CHANGE_GOL_DELEGATION',
    payload: status,
  };
};

export const setGolLifeTime = status => {
  return {
    type: 'CHANGE_GOL_LIFETIME',
    payload: status,
  };
};
