export const initialState = {
  load: 0,
  delegation: 0,
  lifetime: 0,
};

const golReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_GOL_LOAD': {
      return {
        ...state,
        load: action.payload,
      };
    }

    case 'CHANGE_GOL_DELEGATION': {
      return {
        ...state,
        delegation: action.payload,
      };
    }

    case 'CHANGE_GOL_LIFETIME': {
      return {
        ...state,
        lifetime: action.payload,
      };
    }

    default:
      return state;
  }
};

export default golReducer;
