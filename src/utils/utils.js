const formatNumber = (number, toFixed) => {
  let formatted = number;

  if (toFixed) {
    formatted = formatted.toFixed(toFixed);
  }
  // debugger;
  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

const getDecimal = (number, toFixed) => {
  let nstring = number.toString();
  let narray = nstring.split('.');
  let result = narray.length > 1 ? narray[1] : '0';
  return result;
};

const run = async func => {
  try {
    await func();
  } catch (error) {
    setTimeout(run, 1000, func);
  }
};

const roundNumber = (num, scale) => {
  if (!`${num}`.includes('e')) {
    return +`${Math.floor(`${num}e+${scale}`)}e-${scale}`;
  }
  const arr = `${num}`.split('e');
  let sig = '';
  if (+arr[1] + scale > 0) {
    sig = '+';
  }
  const i = `${+arr[0]}e${sig}${+arr[1] + scale}`;
  const j = Math.floor(i);
  const k = +`${j}e-${scale}`;
  return k;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const timer = func => {
  setInterval(func, 10000);
};

export { run, roundNumber, formatNumber, asyncForEach, timer, getDecimal };
