export const initialState = {
  takeoff: 0,
  relevance: 0,
  load: 0,
  delegation: 0,
  lifetime: 0,
  euler4Rewards: 0,
  takeoffPrize: 0,
  relevancePrize: 0,
  loadPrizePrize: 0,
  delegationPrize: 0,
  lifetimePrize: 0,
  euler4RewardsPrize: 0,
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

    case 'CHANGE_GOL_TAKEOFF': {
      return {
        ...state,
        takeoff: action.payload,
      };
    }

    case 'CHANGE_GOL_RELEVANCE': {
      return {
        ...state,
        relevance: action.payload,
      };
    }

    case 'CHANGE_GOL_EULER4REWARDS': {
      return {
        ...state,
        euler4Rewards: action.payload,
      };
    }

    case 'CHANGE_GOL_LOAD_PRIZE': {
      return {
        ...state,
        loadPrize: action.payload,
      };
    }

    case 'CHANGE_GOL_DELEGATION_PRIZE': {
      return {
        ...state,
        delegationPrize: action.payload,
      };
    }

    case 'CHANGE_GOL_LIFETIME_PRIZE': {
      return {
        ...state,
        lifetimePrize: action.payload,
      };
    }

    case 'CHANGE_GOL_TAKEOFF_PRIZE': {
      return {
        ...state,
        takeoffPrize: action.payload,
      };
    }

    case 'CHANGE_GOL_RELEVANCE_PRIZE': {
      return {
        ...state,
        relevancePrize: action.payload,
      };
    }

    case 'CHANGE_GOL_EULER4REWARDS_PRIZE': {
      return {
        ...state,
        euler4RewardsPrize: action.payload,
      };
    }

    default:
      return state;
  }
};

export default golReducer;