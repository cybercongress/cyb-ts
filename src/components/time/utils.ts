const unixTimestamp = (secondsTime: number) => {
  const days = Math.floor(secondsTime / 86400);
  const hours = Math.floor(((secondsTime % 31536000) % 86400) / 3600);
  const minutes = Math.floor((((secondsTime % 31536000) % 86400) % 3600) / 60);
  const seconds = Math.floor((((secondsTime % 31536000) % 86400) % 3600) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export default unixTimestamp;
