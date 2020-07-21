import { POCKET } from '../../utils/config';

export const initialState = {
  actionBar: {
    tweet: POCKET.STAGE_TWEET_ACTION_BAR.TWEET, // stage for tweet ActionBar: 'addAvatar' 'follow' 'tweet'
  },
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

    default:
      return state;
  }
};

export default pocketReducer;
