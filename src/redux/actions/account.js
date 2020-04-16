export const setAccount = (address, type) => {
  return {
    type: 'SET_ACCOUNT',
    address,
    type,
  };
};
