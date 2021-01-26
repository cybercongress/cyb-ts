import { useEffect, useState, useRef } from 'react';
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Route as RouteUniswap,
} from '@uniswap/sdk';
import { AUCTION, CYBER, TAKEOFF, GENESIS_SUPPLY } from '../../../utils/config';

function useGetCybernomics() {
  const [donation, setDonation] = useState(0);
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
    getCYB();
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
      supply: parseFloat(AUCTION.TOKEN_ALOCATION * CYBER.DIVISOR_CYBER_G),
      price: currentPriceGol * CYBER.DIVISOR_CYBER_G,
      cap: parseFloat(
        currentPriceGol * AUCTION.TOKEN_ALOCATION * CYBER.DIVISOR_CYBER_G
      ),
      loading: false,
    };
    setCybernomics((item) => ({
      ...item,
      gol,
    }));
  };

  const getCYB = async () => {
    const amount = TAKEOFF.FINISH_AMOUNT;
    const currentPrice = TAKEOFF.FINISH_PRICE;

    const supplyEUL = parseFloat(GENESIS_SUPPLY);
    const capATOM = (supplyEUL / CYBER.DIVISOR_CYBER_G) * currentPrice;

    const cyb = {
      cap: capATOM,
      price: currentPrice,
      supply: GENESIS_SUPPLY,
      loading: false,
    };

    const donationAtom = amount / TAKEOFF.ATOMsALL;
    setDonation(donationAtom);
    setCybernomics((item) => ({
      ...item,
      cyb,
    }));
  };

  return {
    cybernomics,
    donation,
  };
}

export default useGetCybernomics;
