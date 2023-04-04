import React, { useState } from 'react';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { connect } from 'react-redux';
import { CYBER } from 'src/utils/config';
import useSdk from 'src/hooks/useSdk';
import { DefaultAccountType } from './type';
import { usePoolListInterval, useGetParams } from './hooks/useGetPoolsTs';
import { useSearchParams } from 'react-router-dom';
import { MainContainer } from 'src/components';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

interface TeleportProps {
  defaultAccount: DefaultAccountType;
}

type TypeTxsT = 'swap' | 'deposit' | 'withdraw';

function Teleport({ defaultAccount }: TeleportProps) {
  const queryClient = useSdk();
  const poolsData = usePoolListInterval();
  const params = useGetParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [update, setUpdate] = useState<number>(0);
  const [tokenA, setTokenA] = useState<string>(tokenADefaultValue);
  const [tokenB, setTokenB] = useState<string>(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState<string>('');
  const [tokenBAmount, setTokenBAmount] = useState<string>('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState<number>(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState<number>(0);
  const [networkA, setNetworkA] = useState<string>(CYBER.CHAIN_ID);
  const [networkB, setNetworkB] = useState<string>(CYBER.CHAIN_ID);
  const [selectedPool, setSelectedPool] = useState<Pool[]>([]);
  const [swapPrice, setSwapPrice] = useState<number>(0);
  const [amountPoolCoin, setAmountPoolCoin] = useState<string>('');
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const [typeTxs, setTypeTxs] = useState<TypeTxsT>('swap');


  console.log('first', defaultAccount);

  console.log('poolsData', poolsData);
  console.log('params', params);

  return (
    <>
      <MainContainer width="62%">
        <div>Teleport</div>
      </MainContainer>
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Teleport);
