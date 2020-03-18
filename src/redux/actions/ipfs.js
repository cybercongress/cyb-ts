export const initIpfs = ipfs => {
  return {
    type: 'INIT_IPFS',
    payload: ipfs,
  };
};

export const setIpfsStatus = status => {
  return {
    type: 'SET_STATUS',
    payload: status,
  };
};
