import { Coin } from '@cosmjs/launchpad';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useAppData } from 'src/contexts/appData';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { Nullable } from 'src/types';
import { CYBER } from 'src/utils/config';
import { getDisplayAmount } from 'src/utils/utils';

export type responseWarpDexTickersItem = {
  base_currency: string;
  target_currency: string;
  pool_id: number;
  ticker_id: string;
  last_price: number;
  liquidity_in_usd: number;
  base_volume: number;
  target_volume: number;
};

const getWarpDexTickers = async (): Promise<
  Nullable<responseWarpDexTickersItem[]>
> => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://warp-dex.cybernode.ai/dev/tickers/',
    });

    return response.data as responseWarpDexTickersItem[];
  } catch (e) {
    return null;
  }
};

export default function useWarpDexTickers() {
  const { marketData } = useAppData();
  const [vol24, setVol24] = useState<Coin | undefined>(undefined);
  const { traseDenom } = useIbcDenom();

  const { data } = useQuery({
    queryKey: ['warp-dex-tickers'],
    queryFn: async () => {
      const responce = await getWarpDexTickers();

      if (responce !== null) {
        return responce;
      }

      return undefined;
    },
  });

  useEffect(() => {
    let vol24Temp = new BigNumber(0);

    if (Object.keys(marketData).length && data && traseDenom) {
      data.forEach((item: responseWarpDexTickersItem) => {
        if (marketData[item.base_currency]) {
          const pollPrice = new BigNumber(marketData[item.base_currency]);
          const [{ coinDecimals }] = traseDenom(item.base_currency);
          const reduceAmount = getDisplayAmount(item.base_volume, coinDecimals);
          const amount = pollPrice.multipliedBy(reduceAmount);
          vol24Temp = vol24Temp.plus(amount);
        }

        if (marketData[item.target_currency]) {
          const pollPrice = new BigNumber(marketData[item.target_currency]);
          const [{ coinDecimals }] = traseDenom(item.target_currency);
          const reduceAmount = getDisplayAmount(
            item.target_volume,
            coinDecimals
          );
          const amount = pollPrice.multipliedBy(reduceAmount);
          vol24Temp = vol24Temp.plus(amount);
        }
      });

      setVol24({
        denom: CYBER.DENOM_LIQUID_TOKEN,
        amount: vol24Temp.dp(0, BigNumber.ROUND_FLOOR).toString(10),
      });
    }
  }, [marketData, data, traseDenom]);

  return { data, vol24 };
}
