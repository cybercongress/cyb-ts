import { useContext, useEffect, useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import Long from 'long';
import { Link, useHistory } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import {
  ActionBarContentText,
  Account,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../components';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import {
  fromBech32,
  trimString,
  selectNetworkImg,
  convertAmountReverce,
  convertAmount,
} from '../../utils/utils';
import { sortReserveCoinDenoms } from './utils';
import networks from '../../utils/networkListIbc';
import { BtnGrd, ActionBarSteps } from '../portal/components';

import ActionBarStaps from './actionBarSteps';

import useGetPassportByAddress from '../sigma/hooks/useGetPassportByAddress';

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

const coinFunc = (amount, denom) => {
  return { denom, amount: new BigNumber(amount).toString(10) };
};

function ActionBar({ stateActionBar }) {
  const { keplr, jsCyber, traseDenom } = useContext(AppContext);
  const history = useHistory();
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

  const { passport } = useGetPassportByAddress(addressActive);

  useEffect(() => {
    let orderPrice = 0;

    const poolAmountA = new BigNumber(Number(tokenAPoolAmount));
    const poolAmountB = new BigNumber(Number(tokenBPoolAmount));

    if (poolAmountA.comparedTo(0) > 0 && poolAmountB.comparedTo(0) > 0) {
      if ([tokenA, tokenB].sort()[0] !== tokenA) {
        orderPrice = poolAmountB.dividedBy(poolAmountA);
        orderPrice = orderPrice.multipliedBy(0.97).toNumber();
      } else {
        orderPrice = poolAmountA.dividedBy(poolAmountB);
        orderPrice = orderPrice.multipliedBy(1.03).toNumber();
      }
    }

    // console.log('orderPrice useEffect', orderPrice);
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
  //   const logsValue = parseLog(logs.parseRawLog(testVar));
  //   console.log('logsValue', logsValue);
  // }, []);

  // const parseLog = (log) => {
  //   try {
  //     if (log && Object.keys(log).length > 0) {
  //       const { events } = log[0];
  //       if (events) {
  //         // eslint-disable-next-line no-restricted-syntax
  //         for (const event of events) {
  //           if (event.type === 'send_packet') {
  //             const { attributes } = event;
  //             const sourceChannelAttr = attributes.find(
  //               (attr) => attr.key === 'packet_src_channel'
  //             );
  //             const sourceChannelValue = sourceChannelAttr
  //               ? sourceChannelAttr.value
  //               : undefined;
  //             const destChannelAttr = attributes.find(
  //               (attr) => attr.key === 'packet_dst_channel'
  //             );
  //             const destChannelValue = destChannelAttr
  //               ? destChannelAttr.value
  //               : undefined;
  //             const sequenceAttr = attributes.find(
  //               (attr) => attr.key === 'packet_sequence'
  //             );
  //             const sequence = sequenceAttr ? sequenceAttr.value : undefined;
  //             const timeoutHeightAttr = attributes.find(
  //               (attr) => attr.key === 'packet_timeout_height'
  //             );
  //             const timeoutHeight = timeoutHeightAttr
  //               ? timeoutHeightAttr.value
  //               : undefined;
  //             const timeoutTimestampAttr = attributes.find(
  //               (attr) => attr.key === 'packet_timeout_timestamp'
  //             );
  //             const timeoutTimestamp = timeoutTimestampAttr
  //               ? timeoutTimestampAttr.value
  //               : undefined;

  //             if (sequence && destChannelValue && sourceChannelValue) {
  //               return {
  //                 destChannel: destChannelValue,
  //                 sourceChannel: sourceChannelValue,
  //                 sequence,
  //                 timeoutHeight,
  //                 timeoutTimestamp,
  //               };
  //             }
  //           }
  //         }
  //       }
  //     }
  //     return null;
  //   } catch (e) {
  //     console.log('error parseLog', e);
  //     return null;
  //   }
  // };

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

    const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);
    const { coinDecimals: coinDecimalsB } = traseDenom(tokenB);

    const reduceAmountA = convertAmountReverce(tokenAAmount, coinDecimalsA);
    const reduceAmountB = convertAmountReverce(tokenBAmount, coinDecimalsB);

    let depositCoins = [];

    if ([tokenA, tokenB].sort()[0] === tokenA) {
      depositCoins = [
        coinFunc(reduceAmountA, tokenA),
        coinFunc(reduceAmountB, tokenB),
      ];
    } else {
      depositCoins = [
        coinFunc(reduceAmountB, tokenB),
        coinFunc(reduceAmountA, tokenA),
      ];
    }
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
    const depositCoins = coinFunc(Number(amountPoolCoin), selectMyPool);

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

    const { coinDecimals: coinDecimalsA } = traseDenom(
      arrangedReserveCoinDenoms[0]
    );
    const { coinDecimals: coinDecimalsB } = traseDenom(
      arrangedReserveCoinDenoms[1]
    );

    deposit[arrangedReserveCoinDenoms[0]] = convertAmountReverce(
      deposit[arrangedReserveCoinDenoms[0]],
      coinDecimalsA
    );

    deposit[arrangedReserveCoinDenoms[1]] = convertAmountReverce(
      deposit[arrangedReserveCoinDenoms[1]],
      coinDecimalsB
    );

    const depositCoins = [
      coinFunc(
        deposit[arrangedReserveCoinDenoms[0]],
        arrangedReserveCoinDenoms[0]
      ),
      coinFunc(
        deposit[arrangedReserveCoinDenoms[1]],
        arrangedReserveCoinDenoms[1]
      ),
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

    let amountTokenA = tokenAAmount;

    const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);

    amountTokenA = convertAmountReverce(amountTokenA, coinDecimalsA);

    setStage(STAGE_SUBMITTED);
    const offerCoinFee = coinFunc(
      Math.ceil(
        parseFloat(amountTokenA) *
          convertAmount(parseFloat(params.swapFeeRate), 18) *
          0.5
      ),
      tokenA
    );

    const offerCoin = coinFunc(parseFloat(amountTokenA), tokenA);
    console.log('offerCoin', offerCoin);
    const demandCoinDenom = tokenB;
    console.log(`swapPrice`, swapPrice);

    const exp = new BigNumber(10).pow(18).toString();
    const convertSwapPrice = new BigNumber(swapPrice)
      .multipliedBy(exp)
      .dp(0, BigNumber.ROUND_FLOOR)
      .toString(10);
    if (addressActive !== null && addressActive.bech32 === address) {
      try {
        const response = await keplr.swapWithinBatch(
          address,
          parseFloat(selectedPool.id),
          POOL_TYPE_INDEX,
          offerCoin,
          demandCoinDenom,
          offerCoinFee,
          convertSwapPrice,
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
    const [{ address: counterpartyAccount }] = await keplr.signer.getAccounts();

    setStage(STAGE_SUBMITTED);

    const sourcePort = 'transfer';

    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);
    const amount = convertAmountReverce(tokenAAmount, coinDecimalsA);

    const transferAmount = coinFunc(amount, denomIbc);
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
    const gasEstimation = await ibcClient.simulate(address, [msg], '');
    const feeIbc = {
      amount: [],
      gas: Math.round(gasEstimation * 1.5).toString(),
    };
    try {
      const response = await ibcClient.signAndBroadcast(
        address,
        [msg],
        feeIbc,
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
  }, [tokenA, ibcClient, tokenAAmount, denomIbc, keplr]);

  const withdrawOnClick = useCallback(async () => {
    let prefix;
    setStage(STAGE_SUBMITTED);
    if (Object.prototype.hasOwnProperty.call(networks, networkB)) {
      prefix = networks[networkB].prefix;
    }
    const [{ address }] = await keplr.signer.getAccounts();
    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(address, prefix);
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);
    const amount = convertAmountReverce(tokenAAmount, coinDecimalsA);
    const transferAmount = coinFunc(amount, tokenA);
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

  const handleHistory = (to) => {
    history.push(to);
  };

  if (passport === null && CYBER.CHAIN_ID === 'bostrom') {
    return (
      <ActionBarCenter
        btnText="get citizenship"
        onClickFnc={() => handleHistory('/portal')}
      />
    );
  }

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
      <ActionBarSteps>
        <BtnGrd
          onClick={() => handleHistory('/warp/create-pool')}
          text="Create pool"
        />
      </ActionBarSteps>
    );
  }

  if (selectedTab === 'createPool' && stage === STAGE_INIT) {
    return (
      <ActionBarCenter
        disabled={isExceeded}
        btnText="create pool"
        onClickFnc={() => createPool()}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          price 1 000 000 000
          <img
            style={{ width: '20px' }}
            src={selectNetworkImg(CYBER.CHAIN_ID)}
            alt="img"
          />
        </div>
      </ActionBarCenter>
    );
  }

  if (selectedTab === 'sub-liquidity' && stage === STAGE_INIT) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={isExceeded}
          onClick={() => withdwawWithinBatch()}
          text="withdrawal"
        />
      </ActionBarSteps>
    );
  }

  if (selectedTab === 'add-liquidity' && stage === STAGE_INIT) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={isExceeded}
          onClick={() => depositWithinBatch()}
          text="deposit"
        />
      </ActionBarSteps>
    );
  }

  if (selectedTab === 'swap' && typeTxs === 'swap' && stage === STAGE_INIT) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={isExceeded}
          onClick={() => swapWithinBatch()}
          text="swap"
        />
      </ActionBarSteps>
    );
  }

  if (selectedTab === 'swap' && typeTxs === 'deposit' && stage === STAGE_INIT) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={ibcClient === null}
          onClick={() => depositOnClick()}
          text="deposit"
        />
      </ActionBarSteps>
    );
  }

  if (
    selectedTab === 'swap' &&
    typeTxs === 'withdraw' &&
    stage === STAGE_INIT
  ) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={keplr === null}
          onClick={() => withdrawOnClick()}
          text="withdraw"
        />
      </ActionBarSteps>
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
