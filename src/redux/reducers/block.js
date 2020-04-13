export const initialState = {
  block: 0,
};

const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BLOCK': {
      return {
        ...state,
        block: action.payload,
      };
    }

    default:
      return state;
  }
};

export default blockReducer;
