import { Osmosis } from './assets';

// eslint-disable-next-line import/prefer-default-export
export const assetsBuy = Array.from(
  new Map(
    Osmosis.Assets.filter((item) =>
      ['hydrogen', 'ampere', 'volt'].includes(item.display)
    ).map((item) => [item.base, item])
  ).values()
);
