export const setStageTweetActionBar = (stage) => {
  return {
    type: 'SET_STAGE_TWEET_ACTION_BAR',
    payload: stage,
  };
};

export const setDefaultAccount = (name, account) => {
  return {
    type: 'SET_DEFAULT_ACCOUNT',
    name,
    account,
  };
};
