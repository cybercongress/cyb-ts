// eslint-disable-next-line import/prefer-default-export
export const setQuery = (query) => {
  return {
    type: 'SET_QUERY',
    payload: query,
  };
};
