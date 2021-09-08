import React, { useContext, useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots, ValueImg } from '../../../components';
import { AppContext } from '../../../context';
import { reduceAmounToken } from '../utils';
import { formatNumber } from '../../../utils/utils';

const PoolTokenAmount = ({ addressPool, token }) => {
  const { jsCyber } = useContext(AppContext);
  const [amounToken, setAmounToken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBalances = async () => {
      setLoading(true);
      if (jsCyber !== null) {
        const getBalancePromise = await jsCyber.getBalance(addressPool, token);
        setAmounToken(parseFloat(getBalancePromise.amount));
        setLoading(false);
      }
    };
    getBalances();
  }, [jsCyber, addressPool, token]);

  return (
    <Pane>
      {loading ? <Dots /> : formatNumber(reduceAmounToken(amounToken, token))}
    </Pane>
  );
};

const PoolItemsList = ({ addressPool, token }) => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    marginBottom={10}
  >
    <ValueImg
      style={{
        flexDirection: 'row-reverse',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text={token}
      marginImg="0 5px"
    />
    <PoolTokenAmount addressPool={addressPool} token={token} />
  </Pane>
);

export default PoolItemsList;
