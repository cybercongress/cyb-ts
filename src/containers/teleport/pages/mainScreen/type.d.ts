import { responseWarpDexTickersItem } from "src/hooks/useGetWarpPools";

export type DefaultPairPoolIdItem = {
  reverse: boolean;
};

export type DefaultPairPoolIdObj = {
  [key: number]: DefaultPairPoolIdItem;
};

export type SelectedPool = DefaultPairPoolIdItem & responseWarpDexTickersItem;
