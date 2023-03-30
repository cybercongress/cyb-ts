// eslint-disable-next-line import/prefer-default-export
export const setBlock = (block) => {
  return {
    type: 'SET_BLOCK',
    payload: block,
  };
};
