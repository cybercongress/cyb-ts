const initialState = {
  ipfs: null,
  statusIpfs: false,
  id: null,
  failed: null,
  ready: false,
  pending: false,
  ipfsOpts: null,
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

    case 'SET_ID': {
      return {
        ...state,
        id: action.payload,
      };
    }

    case 'SET_FAILED': {
      return {
        ...state,
        failed: action.payload,
      };
    }

    case 'SET_READY': {
      return {
        ...state,
        ready: action.payload,
      };
    }

    case 'SET_PENDING': {
      return {
        ...state,
        pending: action.payload,
      };
    }

    case 'SET_IPFS_OPTS': {
      return {
        ...state,
        ipfsOpts: action.payload,
      };
    }

    default:
      return state;
  }
};

export default ipfsReducer;
