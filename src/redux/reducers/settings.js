const initialState = {
  mobile: false,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DETECTED_DEVICE': {
      return {
        ...state,
        mobile: action.payload,
      };
    }

    default:
      return state;
  }
};

export default settingsReducer;
