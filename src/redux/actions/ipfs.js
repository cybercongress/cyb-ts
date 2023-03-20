export const initIpfs = (ipfs) => {
  return {
    type: 'INIT_IPFS',
    payload: ipfs,
  };
};

export const setIpfsStatus = (status) => {
  return {
    type: 'SET_STATUS',
    payload: status,
  };
};

export const setIpfsID = (status) => {
  return {
    type: 'SET_ID',
    payload: status,
  };
};

export const setIpfsFailed = (status) => {
  return {
    type: 'SET_FAILED',
    payload: status,
  };
};
export const setIpfsReady = (status) => {
  return {
    type: 'SET_READY',
    payload: status,
  };
};

export const setIpfsPending = (status) => {
  return {
    type: 'SET_PENDING',
    payload: status,
  };
};

export const setIpfsOpts = (status) => {
  return {
    type: 'SET_IPFS_OPTS',
    payload: status,
  };
};
