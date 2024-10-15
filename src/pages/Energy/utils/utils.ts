import { Asset as OsmosisAsset } from '@chain-registry/types';
import { CoinDenom, Exponent } from '@osmonauts/math/types';
import { Osmosis } from './assets';

export const getOsmoAssetByDenom = (
  denom: CoinDenom
): OsmosisAsset | undefined => {
  const asset = Osmosis.Assets.find((asset) => asset.base === denom);
  if (!asset) {
    // throw new Error(`Asset not found: ${denom}`);
    return undefined;
  }
  return asset;
};

export const symbolToOsmoDenom = (token: string): CoinDenom | undefined => {
  const asset = Osmosis.Assets.find(({ symbol }) => symbol === token);
  const base = asset?.base;
  if (!base) {
    console.log(`cannot find base for token ${token}`);
    return undefined;
  }
  return base;
};

export const getExponentByDenom = (denom: CoinDenom): Exponent => {
  const asset = getOsmoAssetByDenom(denom);
  if (!asset) {
    return 0;
  }
  const unit = asset.denom_units.find(({ denom }) => denom === asset.display);
  return unit?.exponent || 0;
};

export function paginate(limit = 100n, offset = 0n) {
  return {
    limit,
    offset,
    key: new Uint8Array(),
    countTotal: true,
    reverse: false,
  };
}

export const isEmptyArray = (arr: any[]) => arr.length === 0;
