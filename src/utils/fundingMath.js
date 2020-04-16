import { TAKEOFF } from './config';
import { x, y, z } from './list';

const {
  CYBWON_A,
  CYBWON_B,
  CYBWON_C,
  CYBWON_D,
  GETSHARES_A,
  GETSHARES_B,
  GETSHARES_C,
  GETSHARES_D,
  DISCOUNT_TG,
  DISCOUNT_TILT_ANGLE,
} = TAKEOFF;

const getShares = atoms => {
  const shares =
    GETSHARES_A +
    GETSHARES_B * atoms -
    GETSHARES_C * atoms ** 2 +
    GETSHARES_D * atoms ** 3;
  return shares;
};

const getDiscountPlot = atoms => {
  const discount = DISCOUNT_TG * atoms + DISCOUNT_TILT_ANGLE;
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
    CYBWON_A * Math.pow(atom, 3) +
    CYBWON_B * Math.pow(atom, 2) +
    CYBWON_C * atom +
    CYBWON_D;
  return won;
};

const getDisciplinesAllocation = atom => {
  const allocation =
    1.2 +
    (CYBWON_A * atom ** 3 + CYBWON_B * atom ** 2 + CYBWON_C * atom + CYBWON_D) *
      0.466666;
  return allocation;
};

const getRewards = (price, discount, atoms, amount) => {
  const rewards =
    price + (price * discount) / 2 - ((price * discount) / atoms) * amount;
  return rewards;
};

const getGroupAddress = data => {
  const groupsAddress = data.reverse().reduce((obj, item) => {
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
  const groups = Object.keys(groupsAddress).reduce(
    (obj, key) => ({
      ...obj,
      [key]: {
        address: groupsAddress[key],
        height: null,
        amountСolumn: null,
        pin: false,
        cyb: null,
      },
    }),
    {}
  );

  Object.keys(groups).forEach(key => {
    let sum = 0;
    let sumEstimation = 0;
    groups[key].address.forEach(addressKey => {
      sum += addressKey.amount;
      sumEstimation += addressKey.cybEstimation;
    });
    groups[key].height = groups[key].address[0].height;
    groups[key].amountСolumn = sum;
    groups[key].cyb = sumEstimation;
  });
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
  getDisciplinesAllocation,
};
