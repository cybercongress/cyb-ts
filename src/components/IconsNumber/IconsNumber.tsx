import BigNumber from 'bignumber.js';
import hydrogen from '../../image/hydrogen.svg';

enum TypesEnum {
  'karma' = 'karma',
  'hydrogen' = 'hydrogen',
}

type Types = TypesEnum.karma | TypesEnum.hydrogen;

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
};

const PREFIXES = [
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
