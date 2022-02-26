import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import Long from 'long';
// import { logs } from '@cosmjs/stargate';
import { Link } from 'react-router-dom';
import { coin, coins } from '@cosmjs/launchpad';
import BigNumber from 'bignumber.js';
import { ActionBarContentText, Account, LinkWindow } from '../../components';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import {
  exponentialToDecimal,
  coinDecimals,
  fromBech32,
  trimString,
} from '../../utils/utils';
import { getTxs } from '../../utils/search/utils';
import { sortReserveCoinDenoms, reduceAmounToken, networkList } from './utils';
import coinDecimalsConfig from '../../utils/configToken';
import { networkList as networks } from './hooks/useGetBalancesIbc';

import ActionBarStaps from './actionBarSteps';

// import testVar from './testJson.json';

const POOL_TYPE_INDEX = 1;

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const STAGE_CONFIRMED_IBC = 7.1;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

function ActionBar({ stateActionBar }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHashIbc, setTxHashIbc] = useState(null);
  const [linkIbcTxs, setLinkIbcTxs] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [swapPrice, setSwapPrice] = useState(0);

  const {
    addressActive,
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    params,
    selectedPool,
    selectedTab,
    updateFunc,
    selectMyPool,
    myPools,
    amountPoolCoin,
    isExceeded,
    tokenAPoolAmount,
    tokenBPoolAmount,
    typeTxs,
    ibcClient,
    denomIbc,
    sourceChannel,
    networkB,
  } = stateActionBar;

  useEffect(() => {
    let orderPrice = 0;

    const poolAmountA = new BigNumber(Number(tokenAPoolAmount));
    const poolAmountB = new BigNumber(Number(tokenBPoolAmount));

    if ([tokenA, tokenB].sort()[0] !== tokenA) {
      orderPrice = poolAmountB.dividedBy(poolAmountA);
      orderPrice = orderPrice.multipliedBy(0.97).toNumber();
    } else {
      orderPrice = poolAmountA.dividedBy(poolAmountB);
      orderPrice = orderPrice.multipliedBy(1.03).toNumber();
    }

    console.log('orderPrice useEffect', orderPrice);
    if (orderPrice && orderPrice !== Infinity) {
      setSwapPrice(orderPrice);
    }
  }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount]);

  // useEffect(() => {
  //   let orderPrice = 0;

  //   if (tokenAAmount.length > 0) {
  //     const amountTokenA = reduceAmounToken(tokenAAmount, tokenA, true);
  //     const poolAmountA = tokenAPoolAmount;
  //     const poolAmountB = tokenBPoolAmount;
  //     const poolFee = 1 - 0.03;
  //     const imputNumber2 = amountTokenA * 2;
  //     if ([tokenA, tokenB].sort()[0] !== tokenA) {
  //       const firstNumber = poolAmountB * poolFee;
  //       const secondNumb = poolAmountA + imputNumber2;
  //       const testPrice = firstNumber / secondNumb;
  //       orderPrice = testPrice;
  //     } else {
  //       const firstNumber = poolAmountA * poolFee;
  //       const secondNumb = poolAmountB + imputNumber2;
  //       const testPrice = firstNumber / secondNumb;
  //       orderPrice = testPrice;
  //     }
  //   }

  //   console.log('orderPrice', orderPrice);
  //   // if (orderPrice && orderPrice !== Infinity) {
  //   //   setSwapPrice(orderPrice);
  //   // }
  // }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount, tokenAAmount]);

  // useEffect(() => {
  //   let orderPrice = 0;
  //   let amountTokenA = 0;
  //   // setSwapPrice(0);

  //   const poolAmountA = new BigNumber(Number(tokenAPoolAmount));
  //   const poolAmountB = new BigNumber(Number(tokenBPoolAmount));

  //   if (tokenAAmount.length > 0) {
  //     amountTokenA = reduceAmounToken(tokenAAmount, tokenA, true);
  //   }

  //   if ([tokenA, tokenB].sort()[0] !== tokenA) {
  //     const poolFee = 1 + 0.003;
  //     const imputNumber = new BigNumber(amountTokenA).multipliedBy(2);
  //     const secondNumb = poolAmountA.plus(imputNumber);
  //     const testPrice = poolAmountB
  //       .multipliedBy(poolFee)
  //       .dividedBy(secondNumb)
  //       .toNumber();
  //     orderPrice = testPrice;
  //   } else {
  //     const poolFee = 1 - 0.003;
  //     const imputNumber = new BigNumber(amountTokenA).multipliedBy(2);
  //     const secondNumb = poolAmountB.plus(imputNumber);
  //     const testPrice = poolAmountA
  //       .multipliedBy(poolFee)
  //       .dividedBy(secondNumb)
  //       .toNumber();
  //     orderPrice = testPrice;
  //   }

  //   console.log('orderPrice', orderPrice);
  //   // if (orderPrice && orderPrice !== Infinity) {
  //   //   setSwapPrice(orderPrice);
  //   // }
  // }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount, tokenAAmount]);

  // useEffect(() => {
  //   console.log('first', logs.parseRawLog(testVar));
  // }, []);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await jsCyber.getTx(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
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
            setErrorMessage(response.rawLog);
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
      coin(1500000, 'hydrogen'),
    ];
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.createPool(
      address,
      POOL_TYPE_INDEX,
      depositCoins,
      fee
    );

    console.log(`response`, response);
    if (response.code === 0) {
      setTxHash(response.transactionHash);
    } else {
      setTxHash(null);
      setErrorMessage(response.rawLog.toString());
      setStage(STAGE_ERROR);
    }
  };

  const withdwawWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();
    setStage(STAGE_SUBMITTED);

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
      if (response.code === 0) {
        setTxHash(response.transactionHash);
      } else {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
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

    deposit[arrangedReserveCoinDenoms[0]] = reduceAmounToken(
      deposit[arrangedReserveCoinDenoms[0]],
      arrangedReserveCoinDenoms[0],
      true
    );

    deposit[arrangedReserveCoinDenoms[1]] = reduceAmounToken(
      deposit[arrangedReserveCoinDenoms[1]],
      arrangedReserveCoinDenoms[1],
      true
    );

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
      if (response.code === 0) {
        setTxHash(response.transactionHash);
      } else if (response.code === 4) {
        setTxHash(null);
        setErrorMessage('Swap is not working. Wait updates.');
        setStage(STAGE_ERROR);
      } else {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
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

    console.log('tokenAAmount', tokenAAmount);
    let amountTokenA = tokenAAmount;

    if (tokenA === 'millivolt' || tokenA === 'milliampere') {
      amountTokenA *= 1000;
    }

    if (tokenA.includes('ibc')) {
      amountTokenA = reduceAmounToken(amountTokenA, tokenA, true);
    }

    setStage(STAGE_SUBMITTED);
    const offerCoinFee = coin(
      Math.ceil(
        parseFloat(amountTokenA) *
          coinDecimals(parseFloat(params.swapFeeRate)) *
          0.5
      ),
      tokenA
    );

    const offerCoin = coin(parseFloat(amountTokenA), tokenA);
    console.log('offerCoin', offerCoin);
    const demandCoinDenom = tokenB;
    console.log(`swapPrice`, swapPrice);
    if (addressActive !== null && addressActive.bech32 === address) {
      try {
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

        if (response.code === 0) {
          setTxHash(response.transactionHash);
        } else if (response.code === 4) {
          setTxHash(null);
          setErrorMessage('Swap is not working. Wait updates.');
          setStage(STAGE_ERROR);
        } else {
          setTxHash(null);
          setErrorMessage(response.rawLog.toString());
          setStage(STAGE_ERROR);
        }
      } catch (error) {
        setTxHash(null);
        setErrorMessage(error.toString());
        setStage(STAGE_ERROR);
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
    setTxHashIbc(null);
    setLinkIbcTxs(null);
  };

  // const parseRawLog = useCallback((log) => {
  //   const parsedLogs = logs.parseRawLog(log);
  //   console.log('log', parsedLogs);
  // }, []);

  const depositOnClick = useCallback(async () => {
    console.log('tokenAAmount', tokenAAmount);
    const [{ address }] = await ibcClient.signer.getAccounts();
    setStage(STAGE_SUBMITTED);

    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(
      address,
      CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
    );
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const transferAmount = coin(
      reduceAmounToken(parseFloat(tokenAAmount), tokenA, true),
      denomIbc
    );
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp,
        token: transferAmount,
      },
    };
    console.log('msg', msg);
    try {
      const response = await ibcClient.signAndBroadcast(
        address,
        [msg],
        fee,
        ''
      );
      console.log(`response`, response);
      if (response.code === 0) {
        const responseChainId = ibcClient.signer.chainId;
        setTxHashIbc(response.transactionHash);
        setLinkIbcTxs(
          `${networks[responseChainId].explorerUrlToTx.replace(
            '{txHash}',
            response.transactionHash.toUpperCase()
          )}`
        );
        setStage(STAGE_CONFIRMED_IBC);
        // if (response.rawLog.length > 0) {
        //   parseRawLog(response.rawLog);
        // }
      } else {
        setTxHashIbc(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    } catch (e) {
      console.error(`Caught error: `, e);
      setTxHashIbc(null);
      setErrorMessage(e.toString());
      setStage(STAGE_ERROR);
    }
  }, [tokenA, ibcClient, tokenAAmount, denomIbc]);

  const withdrawOnClick = useCallback(async () => {
    let prefix;
    setStage(STAGE_SUBMITTED);
    if (Object.prototype.hasOwnProperty.call(networks, networkList[networkB])) {
      prefix = networks[networkList[networkB]].prefix;
    }
    const [{ address }] = await keplr.signer.getAccounts();
    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(address, prefix);
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const transferAmount = coin(
      reduceAmounToken(parseFloat(tokenAAmount), tokenA, true),
      tokenA
    );
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp,
        token: transferAmount,
      },
    };
    console.log('msg', msg);
    try {
      const response = await keplr.signAndBroadcast(address, [msg], fee, '');
      console.log(`response`, response);
      if (response.code === 0) {
        setTxHash(response.transactionHash);
      } else {
        setTxHash(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    } catch (e) {
      console.error(`Caught error: `, e);
      setTxHash(null);
      setErrorMessage(e.toString());
      setStage(STAGE_ERROR);
    }
  }, [tokenA, keplr, tokenAAmount, sourceChannel, networkB]);

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

  if (addressActive !== null && addressActive.keys !== 'keplr') {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          Start by connecting keplr wallet to
          <Link style={{ marginLeft: 5 }} to="/">
            your pocket
          </Link>
          .
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'pools' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled onClick={() => createPool()}>
          create Pool
        </Button>
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

  if (selectedTab === 'swap' && typeTxs === 'swap' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={isExceeded} onClick={() => swapWithinBatch()}>
          swap
        </Button>
      </ActionBarContainer>
    );
  }

  if (selectedTab === 'swap' && typeTxs === 'deposit' && stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={ibcClient === null} onClick={() => depositOnClick()}>
          deposit
        </Button>
      </ActionBarContainer>
    );
  }

  if (
    selectedTab === 'swap' &&
    typeTxs === 'withdraw' &&
    stage === STAGE_INIT
  ) {
    return (
      <ActionBarContainer>
        <Button disabled={keplr === null} onClick={() => withdrawOnClick()}>
          withdraw
        </Button>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_CONFIRMED_IBC) {
    return (
      <ActionBarContainer>
        <ActionBarContentText display="inline">
          <Pane display="inline">Transaction Successful: </Pane>{' '}
          <LinkWindow to={linkIbcTxs}>{trimString(txHashIbc, 6, 6)}</LinkWindow>
        </ActionBarContentText>
        <Button marginX={10} onClick={cleatState}>
          Fuck Google
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
