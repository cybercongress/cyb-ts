import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useLocation, useHistory, Route } from 'react-router-dom';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import { useGetParams, usePoolListInterval } from './hooks/useGetPools';
import getBalances from './hooks/getBalances';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import {
  reduceBalances,
  formatNumber,
  coinDecimals,
  roundNumber,
  exponentialToDecimal,
} from '../../utils/utils';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

const defaultTokenList = {
  [CYBER.DENOM_CYBER]: 0,
  [CYBER.DENOM_LIQUID_TOKEN]: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

function CreatePool({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { poolsData } = usePoolListInterval();
  const [tokenA, setTokenA] = useState(tokenADefaultValue);
  const [tokenB, setTokenB] = useState(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    const getTotalSupply = async () => {
      if (jsCyber !== null) {
        const responseTotalSupply = await jsCyber.totalSupply();

        const datareduceTotalSupply = reduceBalances(responseTotalSupply);
        setTotalSupply({ ...defaultTokenList, ...datareduceTotalSupply });
      }
    };
    getTotalSupply();
  }, [jsCyber]);

  return <div>createPool</div>;
}

export default CreatePool;
