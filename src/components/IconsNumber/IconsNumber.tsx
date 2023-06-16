import BigNumber from 'bignumber.js';
import hydrogen from '../../image/hydrogen.svg';

enum TypesEnum {
  'karma' = 'karma',
  'hydrogen' = 'hydrogen',
  'energy' = 'energy',
}

type Types = TypesEnum.karma | TypesEnum.hydrogen | TypesEnum.energy;

const icons = {
  [TypesEnum.karma]: '🔮',
  [TypesEnum.hydrogen]: (
    <img
      height={20}
      style={{
        verticalAlign: 'middle',
      }}
      src={hydrogen}
      alt="hydrogen"
    />
  ),
  [TypesEnum.energy]: '🔋',
};

// TODO: refactor
const PREFIXES = [
  {
    prefix: 7,
    power: 10 ** 21,
  },
  {
    prefix: 6,
    power: 10 ** 18,
  },
  {
    prefix: 5,
    power: 10 ** 15,
  },
  {
    prefix: 4,
    power: 10 ** 12,
  },
  {
    prefix: 3,
    power: 10 ** 9,
  },
  {
    prefix: 2,
    power: 10 ** 6,
  },
  {
    prefix: 1,
    power: 10 ** 3,
  },
];

export default function IconsNumber({ value, type }) {
  const { prefix = 1, power = 1 } =
    PREFIXES.find((powerItem) => value >= powerItem.power) || {};

  const number = new BigNumber(value)
    .dividedBy(power)
    .dp(0, BigNumber.ROUND_FLOOR)
    .toNumber();

  const i = new Array(prefix).fill(icons[type]);
  return (
    <>
      {number} {i}
    </>
  );
}
