export const initialState = {
  account: {
    address: null,
    type: '',
  },
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS': {
      return {
        ...state,
        account: {
          address: action.address,
          type: action.type,
        },
      };
    }

    default:
      return state;
  }
};

export default accountReducer;
