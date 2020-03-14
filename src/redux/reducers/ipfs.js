export const initialState = {
  ipfs: null,
  statusIpfs: 'fail',
};

const ipfsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_IPFS': {
      return {
        ...state,
        ipfs: action.payload,
      };
    }

    case 'SET_STATUS': {
      return {
        ...state,
        statusIpfs: action.payload,
      };
    }

    default:
      return state;
  }
};

export default ipfsReducer;
