import React, { useContext, useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots, Denom } from '../../../components';
import { AppContext } from '../../../context';
import { formatNumber, convertAmount } from '../../../utils/utils';
import FormatNumberTokens from '../../nebula/components/FormatNumberTokens';

export const PoolTokenAmount = ({ addressPool, token }) => {
  const { jsCyber, traseDenom } = useContext(AppContext);
  const [amounToken, setAmounToken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBalances = async () => {
      setLoading(true);
      if (jsCyber !== null) {
        const getBalancePromise = await jsCyber.getBalance(addressPool, token);
        const amount = parseFloat(getBalancePromise.amount);
        const { coinDecimals } = traseDenom(token);
        setAmounToken(convertAmount(amount, coinDecimals));
        setLoading(false);
      }
    };
    getBalances();
  }, [jsCyber, addressPool, token]);

  return <>{loading ? <Dots /> : <FormatNumberTokens value={amounToken} />}</>;
};

const PoolItemsList = ({ addressPool, token, ...props }) => (
  <Pane
    display="flex"
    alignItems="baseline"
    justifyContent="space-between"
    marginBottom={10}
    {...props}
  >
    <Denom
      style={{
        flexDirection: 'row-reverse',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      denomValue={token}
      marginImg="0 5px"
    />
    <PoolTokenAmount addressPool={addressPool} token={token} />
  </Pane>
);

export default PoolItemsList;
