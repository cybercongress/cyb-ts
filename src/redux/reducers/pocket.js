import { POCKET } from '../../utils/config';

export const initialState = {
  actionBar: {
    tweet: POCKET.STAGE_TWEET_ACTION_BAR.TWEET, // stage for tweet ActionBar: 'addAvatar' 'follow' 'tweet'
  },
  defaultAccount: {
    name: null,
    account: null,
  },
  accounts: null,
};

const pocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STAGE_TWEET_ACTION_BAR': {
      return {
        ...state,
        actionBar: {
          tweet: action.payload,
        },
      };
    }

    case 'SET_DEFAULT_ACCOUNT': {
      return {
        ...state,
        defaultAccount: {
          name: action.name,
          account: action.account,
        },
      };
    }

    case 'SET_ACCOUNTS': {
      return {
        ...state,
        accounts: action.payload,
      };
    }

    default:
      return state;
  }
};

export default pocketReducer;
