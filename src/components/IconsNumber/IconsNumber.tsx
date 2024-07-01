import BigNumber from 'bignumber.js';
import React from 'react';
import hydrogen from '../../image/hydrogen.svg';
import Tooltip from '../tooltip/tooltip';

enum TypesEnum {
  'karma' = 'karma',
  'hydrogen' = 'hydrogen',
  'energy' = 'energy',
  'boot' = 'boot',
  'pussy' = 'pussy',
}

// type Types = TypesEnum.karma | TypesEnum.hydrogen | TypesEnum.energy;

const icons = {
  [TypesEnum.karma]: '🔮',
  [TypesEnum.boot]: '🟢',
  [TypesEnum.hydrogen]: (
    <img
      height={17}
      style={{
        verticalAlign: 'middle',
      }}
      src={hydrogen}
      alt="hydrogen"
    />
  ),
  [TypesEnum.energy]: '🔋',
  [TypesEnum.pussy]: '🟣',
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

export default function IconsNumber({ value, type, isVertical }) {
  const { prefix = 1, power = 1 } =
    PREFIXES.find((powerItem) => value >= powerItem.power) || {};

  const number = new BigNumber(value)
    .dividedBy(power)
    .dp(0, BigNumber.ROUND_FLOOR)
    .toNumber();

  const i = new Array(prefix).fill(icons[type]).map((el, i) => {
    // maybe fix
    if (typeof el === 'object') {
      return React.cloneElement(el, { key: i });
    }

    return el;
  });

  return (
    <>
      {number}{' '}
      <Tooltip
        contentStyle={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
        }}
        tooltip={
          <span style={{ whiteSpace: 'nowrap' }}>
            {value?.toLocaleString()?.replaceAll(',', ' ')}
            {icons[type]}
          </span>
        }
      >
        {i}
      </Tooltip>
    </>
  );
}
