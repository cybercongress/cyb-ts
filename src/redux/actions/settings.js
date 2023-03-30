// eslint-disable-next-line import/prefer-default-export
export const setTypeDevice = (type) => {
  return {
    type: 'SET_DETECTED_DEVICE',
    payload: type,
  };
};
