import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import useGetBalanceMainToken from './useGetBalanceMainToken';
import useBalanceToken from './useBalanceToken';

function useGetBalanceBostrom(address) {
  const { balance: balanceMainToken } = useGetBalanceMainToken(address);
  const { balanceToken } = useBalanceToken(address);
  const [totalAmountInLiquid, setTotalAmountInLiquid] = useState(0);

  // console.log('balance', balance);

  // console.log('first', Decimal.fromAtomics('10000', 6).toString());

  return { totalAmountInLiquid, balanceMainToken, balanceToken };
}

export default useGetBalanceBostrom;
