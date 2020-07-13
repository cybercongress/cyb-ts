export const setBandwidth = (remained, maxValue) => {
  return {
    type: 'SET_BANDWIDTH',
    remained,
    maxValue,
  };
};
