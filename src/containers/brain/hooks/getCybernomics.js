import { useEffect, useState, useRef } from 'react';
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Route as RouteUniswap,
} from '@uniswap/sdk';
import {
  TOTAL_GOL_GENESIS_SUPPLY,
  CYBER,
  TAKEOFF,
  GENESIS_SUPPLY,
} from '../../../utils/config';
import { useGetMarketData } from '../../port/hooks';

function useGetCybernomics() {
  const marketData = useGetMarketData();
  const [cybernomics, setCybernomics] = useState({
    gol: {
      supply: 0,
      price: 0,
      cap: 0,
      loading: true,
    },
    cyb: {
      supply: 0,
      price: 0,
      cap: 0,
      loading: true,
    },
  });

  useEffect(() => {
    getGOL();
  }, []);

  const getGOL = async () => {
    const GOL = new Token(
      ChainId.MAINNET,
      '0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64',
      0
    );
    const pair = await Fetcher.fetchPairData(GOL, WETH[GOL.chainId]);

    const route = new RouteUniswap([pair], WETH[GOL.chainId]);
    const currentPriceGol = route.midPrice.invert().toSignificant(6);
    const gol = {
      supply: parseFloat(TOTAL_GOL_GENESIS_SUPPLY),
      price: currentPriceGol * CYBER.DIVISOR_CYBER_G,
      cap: parseFloat(currentPriceGol * TOTAL_GOL_GENESIS_SUPPLY),
      loading: false,
    };
    setCybernomics((item) => ({
      ...item,
      gol,
    }));
  };

  useEffect(() => {
    if (!marketData.loading) {
      console.log('marketData', marketData);
      const { currentPrice } = marketData;

      const supplyEUL = parseFloat(GENESIS_SUPPLY);
      const capETH = (supplyEUL / CYBER.DIVISOR_CYBER_G) * currentPrice;

      const cyb = {
        cap: capETH,
        price: currentPrice,
        supply: GENESIS_SUPPLY,
        loading: false,
      };

      setCybernomics((item) => ({
        ...item,
        cyb,
      }));
    }
  }, [marketData]);

  return {
    cybernomics,
  };
}

export default useGetCybernomics;
