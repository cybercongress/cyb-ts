import React, { useContext, useEffect, useState } from 'react';
import { Button, Pane } from '@cybercongress/gravity';
import { coins, coin } from '@cosmjs/launchpad';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';

function Teleport() {
  const { keplr, jsCyber } = useContext(AppContext);
  const fee = {
    amount: [],
    gas: DEFAULT_GAS_LIMITS.toString(),
  };

  useEffect(() => {
    const getPools = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.pools();

        console.log(`pools`, response);

        const responsePool = await jsCyber.pool(1);
        console.log(`responsePool`, responsePool);
      }
    };
    getPools();
  }, [jsCyber]);

  const createPool = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = [
      coin(1000000, CYBER.DENOM_CYBER),
      coin(1000000, 'hydrogen'),
    ];
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.createPool(address, 1, depositCoins, fee);

    console.log(`response`, response);
  };

  const withdwawWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = coins(10000, CYBER.DENOM_CYBER);
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.withdwawWithinBatch(
      address,
      1,
      depositCoins,
      fee
    );

    console.log(`response`, response);
  };

  const depositWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = coins(10000, CYBER.DENOM_CYBER);
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.depositWithinBatch(
      address,
      1,
      depositCoins,
      fee
    );

    console.log(`response`, response);
  };

  const swapWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = coins(10000, CYBER.DENOM_CYBER);
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.swapWithinBatch(address, 1, depositCoins, fee);

    console.log(`response`, response);
  };

  return (
    <div>
      {keplr !== null && (
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Button marginY={20} onClick={() => createPool()}>
            createPool
          </Button>
          <Button marginY={20} onClick={() => withdwawWithinBatch()}>
            withdwawWithinBatch
          </Button>
          <Button marginY={20} onClick={() => depositWithinBatch()}>
            depositWithinBatch
          </Button>
          <Button marginY={20} onClick={() => swapWithinBatch()}>
            swapWithinBatch
          </Button>
        </Pane>
      )}
    </div>
  );
}

export default Teleport;
