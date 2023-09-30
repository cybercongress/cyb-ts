import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Nullable } from 'src/types';

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

  return data;
}
