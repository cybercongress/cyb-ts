import React, { useContext, useEffect, useState } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { coin, coins } from '@cosmjs/launchpad';
import { ActionBarContentText, Account } from '../../components';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import { exponentialToDecimal, coinDecimals } from '../../utils/utils';
import { getTxs } from '../../utils/search/utils';
import { sortReserveCoinDenoms } from './utils';

import ActionBarStaps from './actionBarSteps';

const POOL_TYPE_INDEX = 1;

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

function ActionBar({ stateActionBar }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    addressActive,
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    params,
    swapPrice,
    selectedPool,
    selectedTab,
    updateFunc,
    selectMyPool,
    myPools,
    amountPoolCoin,
    isExceeded,
  } = stateActionBar;

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFunc) {
              updateFunc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const createPool = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = [
      coin(1000000, CYBER.DENOM_CYBER),
      coin(1500000, 'milliampere'),
    ];
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.createPool(
      address,
      POOL_TYPE_INDEX,
      depositCoins,
      fee
    );

    console.log(`response`, response);
    if (response.code) {
      setTxHash(null);
      setErrorMessage(response.rawLog.toString());
      setStage(STAGE_ERROR);
    } else {
      setTxHash(response.transactionHash);
    }
  };

  const withdwawWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    let poolId = '';
    if (Object.prototype.hasOwnProperty.call(myPools, selectMyPool)) {
      poolId = myPools[selectMyPool].id;
    }
    const depositCoins = coin(Number(amountPoolCoin), selectMyPool);

    if (addressActive !== null && addressActive.bech32 === address) {
      const response = await keplr.withdwawWithinBatch(
        address,
        parseFloat(poolId),
        depositCoins,
        fee
      );

      console.log(`response`, response);
      if (response.code) {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      } else {
        setTxHash(response.transactionHash);
      }
    } else {
      setErrorMessage(
        <span>
          Add address <Account margin="0 5px" address={address} /> to your
          pocket or make active{' '}
        </span>
      );
      setStage(STAGE_ERROR);
    }
  };

  const depositWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();
    setStage(STAGE_SUBMITTED);
    const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);

    const amountX = Math.floor(Number(tokenAAmount));
    const amountY = Math.floor(Number(tokenBAmount));

    const deposit = {
      [tokenA]: amountX,
      [tokenB]: amountY,
    };

    if (
      arrangedReserveCoinDenoms[0] === 'millivolt' ||
      arrangedReserveCoinDenoms[0] === 'milliampere'
    ) {
      deposit[arrangedReserveCoinDenoms[0]] *= 1000;
    }

    if (
      arrangedReserveCoinDenoms[1] === 'millivolt' ||
      arrangedReserveCoinDenoms[1] === 'milliampere'
    ) {
      deposit[arrangedReserveCoinDenoms[1]] *= 1000;
    }

    const depositCoins = [
      coin(deposit[arrangedReserveCoinDenoms[0]], arrangedReserveCoinDenoms[0]),
      coin(deposit[arrangedReserveCoinDenoms[1]], arrangedReserveCoinDenoms[1]),
    ];

    console.log(`depositCoins`, depositCoins);
    if (addressActive !== null && addressActive.bech32 === address) {
      const response = await keplr.depositWithinBatch(
        address,
        parseFloat(selectedPool.id),
        depositCoins,
        fee
      );

      console.log(`response`, response);
      if (response.code) {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      } else {
        setTxHash(response.transactionHash);
      }
    } else {
      setErrorMessage(
        <span>
          Add address <Account margin="0 5px" address={address} /> to your
          pocket or make active{' '}
        </span>
      );
      setStage(STAGE_ERROR);
    }
  };

  const swapWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    let amountTokenA = tokenAAmount;

    if (tokenA === 'millivolt' || tokenA === 'milliampere') {
      amountTokenA *= 1000;
    }

    setStage(STAGE_SUBMITTED);
    const offerCoinFee = coin(
      Math.floor(
        parseFloat(amountTokenA) *
          coinDecimals(parseFloat(params.swapFeeRate)) *
          0.5
      ),
      tokenA
    );

    const offerCoin = coin(parseFloat(amountTokenA), tokenA);
    const demandCoinDenom = tokenB;
    console.log(`swapPrice`, swapPrice);
    if (addressActive !== null && addressActive.bech32 === address) {
      const response = await keplr.swapWithinBatch(
        address,
        parseFloat(selectedPool.id),
        POOL_TYPE_INDEX,
        offerCoin,
        demandCoinDenom,
        offerCoinFee,
        exponentialToDecimal(swapPrice * 10 ** 18),
        fee
      );

      console.log(`response`, response);

      if (response.code) {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      } else {
        setTxHash(response.transactionHash);
      }
    } else {
      setErrorMessage(
        <span>
          Add address <Account margin="0 5px" address={address} /> to your
          pocket or make active{' '}
        </span>
      );
      setStage(STAGE_ERROR);
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
  };

  if (addressActive === null) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          Start by adding a address to
          <Link style={{ marginLeft: 5 }} to="/">
            your pocket
          </Link>
          .
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'createPool' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button onClick={() => createPool()}>create Pool</Button>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'sub-liquidity' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={isExceeded} onClick={() => withdwawWithinBatch()}>
          Withdrawal
        </Button>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'add-liquidity' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={isExceeded} onClick={() => depositWithinBatch()}>
          Deposit
        </Button>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'swap' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={isExceeded} onClick={() => swapWithinBatch()}>
          swap
        </Button>
      </ActionBarContainer>
    );
  }

  const stageActionBarStaps = {
    stage,
    cleatState,
    txHash,
    txHeight,
    errorMessage,
  };

  return <ActionBarStaps stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
