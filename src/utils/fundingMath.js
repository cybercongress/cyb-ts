import { TAKEOFF } from './config';
import { x, y, z } from './list';

const {
  cybWon_A,
  cybWon_B,
  cybWon_C,
  cybWon_D,
  getShares_A,
  getShares_B,
  getShares_C,
  getShares_D,
} = TAKEOFF;

const getShares = atoms => {
  const shares =
    getShares_A +
    getShares_B * atoms -
    getShares_C * atoms ** 2 +
    getShares_D * atoms ** 3;
  return shares;
};

const getDiscountPlot = atoms => {
  const discount = -0.00005 * atoms + 30;
  return discount;
};

const getDataPlot = atoms => {
  let data = {
    y: [],
    x: [],
    z: [],
  };
  const indexArr = y.indexOf(Math.floor(atoms / 1000) * 1000);
  const newArrY = y.slice(0, indexArr + 1);
  const newArrX = x.slice(0, indexArr + 1);
  const newArrZ = z.slice(0, indexArr + 1);
  data = {
    x: newArrX,
    y: newArrY,
    z: newArrZ,
  };
  data.x.push(getShares(atoms));
  data.y.push(atoms);
  data.z.push(getDiscountPlot(atoms));
  return data;
};

const getEstimation = (price, discount, atoms, value) => {
  const estimation =
    price * value +
    ((price * discount) / 2) * value -
    ((price * discount) / (2 * atoms)) * Math.pow(value, 2);
  return estimation;
};

const funcDiscount = atom => {
  const discount = (5 / Math.pow(10, 7)) * atom;
  return discount;
};

const cybWon = atom => {
  const won =
    cybWon_A * Math.pow(atom, 3) +
    cybWon_B * Math.pow(atom, 2) +
    cybWon_C * atom +
    cybWon_D;
  return won;
};

const getRewards = (price, discount, atoms, amount) => {
  const rewards =
    price + (price * discount) / 2 - ((price * discount) / atoms) * amount;
  return rewards;
};

const getGroupAddress = data => {
  const groups = data.reverse().reduce((obj, item) => {
    obj[item.from] = obj[item.from] || [];
    obj[item.from].push({
      amount: item.amount,
      txhash: item.txhash,
      height: item.height,
      timestamp: item.timestamp,
      cybEstimation: item.estimation,
    });
    return obj;
  }, {});
  return groups;
};

export {
  cybWon,
  funcDiscount,
  getEstimation,
  getShares,
  getDataPlot,
  getRewards,
  getGroupAddress,
};
