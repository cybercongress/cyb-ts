import {
  AvailableAmount,
  DenomArr,
  MainContainer,
  Slider,
} from 'src/components';
import Select, { OptionSelect } from 'src/components/Select';
import { CYBER } from 'src/utils/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import BigNumber from 'bignumber.js';
import { getDisplayAmount, getDisplayAmountReverce } from 'src/utils/utils';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useChannels } from 'src/hooks/useHub';
import { Networks } from 'src/types/networks';
import { getMyTokenBalanceNumber } from '../../utils';
import { useSetupIbcClient } from '../../hooks';
import { Col, GridContainer, TeleportContainer } from '../../components/grid';
import { TypeTxsT } from '../../type';
import ActionBar from './actionBar.bridge';
import HistoryContextProvider from '../../ibc-history/historyContext';
import DataIbcHistory from '../../components/dataIbcHistory/DataIbcHistory';
import InputNumberDecimalScale from '../../components/Inputs/InputNumberDecimalScale';
import { useTeleport } from '../Teleport.context';

type Query = {
  networkFrom: string;
  networkTo: string;
  token: string;
  amount?: string;
};

const isCyberChain = (chainId: string) => chainId === CYBER.CHAIN_ID;

function Bridge() {
  const { traseDenom } = useIbcDenom();
  const { channels } = useChannels();
  const { accountBalances, refreshBalances } = useTeleport();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tokenSelect, setTokenSelect] = useState<string>(
    CYBER.DENOM_LIQUID_TOKEN
  );
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [networkA, setNetworkA] = useState<string>(Networks.BOSTROM);
  const [networkB, setNetworkB] = useState<string>(Networks.SPACE_PUSSY);
  const [typeTxs, setTypeTxs] = useState<TypeTxsT>('deposit');
  const [sourceChannel, setSourceChannel] = useState<string | null>(null);
  const [isExceeded, setIsExceeded] = useState<boolean>(false);

  const { ibcClient, balanceIbc, denomIbc } = useSetupIbcClient(
    tokenSelect,
    typeTxs === 'deposit' ? networkA : networkB
  );

  const firstEffectOccured = useRef(false);

  useEffect(() => {
    if (firstEffectOccured.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const query: Query = {
        networkFrom: networkA,
        networkTo: networkB,
        token: tokenSelect,
      };

      if (Number(tokenAmount) > 0) {
        query.amount = tokenAmount;
      }

      setSearchParams(createSearchParams(query), { replace: true });
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { networkFrom, networkTo, token, amount } = param;
        setNetworkA(networkFrom);
        setNetworkB(networkTo);
        setTokenSelect(token);

        if (Number(amount)) {
          setTokenAmount(amount);
        }
      }
    }
  }, [
    networkA,
    networkB,
    tokenSelect,
    setSearchParams,
    searchParams,
    tokenAmount,
  ]);

  useEffect(() => {
    const isInitialized = channels && networkA && networkB;
    if (!isInitialized) {
      return;
    }

    if (!isCyberChain(networkA) && isCyberChain(networkB)) {
      setTypeTxs('deposit');
      const { destination_channel_id: destChannelId } = channels[networkA];
      setSourceChannel(destChannelId);
    }

    if (isCyberChain(networkA) && !isCyberChain(networkB)) {
      setTypeTxs('withdraw');

      const { source_channel_id: sourceChannelId } = channels[networkB];
      setSourceChannel(sourceChannelId);
    }
  }, [networkB, networkA, channels]);

  const reduceOptionsNetwork = useCallback(
    () =>
      channels
        ? [CYBER.CHAIN_ID, ...Object.keys(channels)].map((key) => ({
            value: key,
            text: (
              <DenomArr
                type="network"
                denomValue={key}
                onlyText
                tooltipStatusText={false}
              />
            ),
            img: (
              <DenomArr
                type="network"
                denomValue={key}
                onlyImg
                tooltipStatusImg={false}
              />
            ),
          }))
        : [],
    [channels]
  );

  const reduceOptions = useMemo(
    () =>
      accountBalances
        ? Object.keys(accountBalances).map((key) => ({
            value: key,
            text: (
              <DenomArr
                denomValue={key}
                onlyText
                tooltipStatusText={tokenSelect !== key}
              />
            ),
            img: <DenomArr denomValue={key} onlyImg tooltipStatusImg={false} />,
          }))
        : [],

    [accountBalances, tokenSelect]
  );

  const getAccountBalancesToken = useCallback(
    (selectNetwork: string) =>
      !isCyberChain(selectNetwork) ? balanceIbc : accountBalances,
    [accountBalances, balanceIbc]
  );

  const getDenomToken = useCallback(
    (selectNetwork: string) =>
      !isCyberChain(selectNetwork) && denomIbc ? denomIbc : tokenSelect,
    [tokenSelect, denomIbc]
  );

  const validInputAmountToken = useMemo(() => {
    if (traseDenom && networkA) {
      const tokenA = getDenomToken(networkA);
      const tokenABalance = getAccountBalancesToken(networkA);
      const myATokenBalance = getMyTokenBalanceNumber(tokenA, tokenABalance);

      if (Number(tokenAmount) > 0) {
        const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);

        const amountToken = parseFloat(
          getDisplayAmountReverce(tokenAmount, coinDecimalsA)
        );

        return amountToken > myATokenBalance;
      }
    }
    return false;
  }, [
    tokenAmount,
    networkA,
    getDenomToken,
    traseDenom,
    getAccountBalancesToken,
  ]);

  useEffect(() => {
    const validNetwork =
      networkA.length > 0 && networkB.length > 0 && networkA !== networkB;

    // check set up ibc cliet for deposit
    const validIbcClient = typeTxs === 'deposit' ? ibcClient !== null : true;

    const validTokenAmount = !validInputAmountToken && Number(tokenAmount) > 0;

    setIsExceeded(!(validNetwork && validIbcClient && validTokenAmount));
  }, [
    networkA,
    networkB,
    typeTxs,
    ibcClient,
    tokenAmount,
    validInputAmountToken,
  ]);

  const setPercentageBalanceHook = useCallback(
    (value: number) => {
      let tokenA;
      let accountBalancesA;
      if (!isCyberChain(networkA) && denomIbc) {
        tokenA = denomIbc;
        accountBalancesA = balanceIbc;
      } else {
        tokenA = tokenSelect;
        accountBalancesA = accountBalances;
      }

      if (
        tokenA &&
        accountBalancesA &&
        accountBalancesA[tokenA] &&
        traseDenom
      ) {
        const [{ coinDecimals }] = traseDenom(tokenA);
        const amount = new BigNumber(accountBalancesA[tokenA])
          .multipliedBy(value)
          .dividedBy(100)
          .dp(coinDecimals, BigNumber.ROUND_FLOOR)
          .toNumber();
        const amount1 = getDisplayAmount(amount, coinDecimals);
        setTokenAmount(amount1);
      }
    },
    [accountBalances, balanceIbc, denomIbc, tokenSelect, traseDenom, networkA]
  );

  const updateFunc = () => refreshBalances();

  const tokenChange = useCallback(() => {
    setNetworkA(networkB);
    setNetworkB(networkA);
  }, [networkB, networkA]);

  const stateActionBar = {
    tokenAmount,
    tokenSelect,
    updateFunc,
    isExceeded,
    typeTxs,
    ibcClient,
    denomIbc,
    sourceChannel,
    networkB,
  };

  const getPercentsOfToken = useCallback(() => {
    const tokenA = getDenomToken(networkA);
    const [{ coinDecimals }] = traseDenom(tokenA);
    const amountTokenA = getDisplayAmountReverce(tokenAmount, coinDecimals); // ?????
    const balance = getAccountBalancesToken(networkA) || {};
    const balanceToken = balance[tokenA] || 0;

    return balanceToken > 0
      ? new BigNumber(amountTokenA)
          .dividedBy(balanceToken)
          .multipliedBy(100)
          .toNumber()
      : 0;
  }, [networkA, tokenAmount]);

  return (
    <HistoryContextProvider>
      <MainContainer width="62%">
        <TeleportContainer>
          <GridContainer>
            <Col>
              <InputNumberDecimalScale
                value={tokenAmount}
                onValueChange={(value) => setTokenAmount(value)}
                title="choose amount to send"
                validAmount={validInputAmountToken}
                tokenSelect={tokenSelect}
              />
              <AvailableAmount
                accountBalances={getAccountBalancesToken(networkA)}
                token={getDenomToken(networkA)}
              />
            </Col>
            <Col>
              <Select
                valueSelect={tokenSelect}
                currentValue={
                  <OptionSelect
                    text="choose"
                    img={<DenomArr denomValue="choose" onlyImg />}
                    value=""
                    bgrImg
                  />
                }
                onChangeSelect={(item: string) => setTokenSelect(item)}
                width="100%"
                options={reduceOptions}
                title="choose token to send"
              />
              <Select
                valueSelect={networkA}
                currentValue={
                  <OptionSelect
                    text="choose"
                    img={<DenomArr denomValue="choose" onlyImg />}
                    value=""
                    bgrImg
                  />
                }
                onChangeSelect={(item: string) => setNetworkA(item)}
                width="100%"
                title="choose source network"
                options={reduceOptionsNetwork(networkB)}
              />
            </Col>
          </GridContainer>

          <Slider
            valuePercents={getPercentsOfToken()}
            onChange={setPercentageBalanceHook}
            onSwapClick={tokenChange}
          />

          <GridContainer>
            <AvailableAmount
              accountBalances={getAccountBalancesToken(networkB)}
              token={getDenomToken(networkB)}
            />

            <Select
              valueSelect={networkB}
              onChangeSelect={(item: string) => setNetworkB(item)}
              width="100%"
              options={reduceOptionsNetwork(networkA)}
              title="destination network"
            />
          </GridContainer>
        </TeleportContainer>
        <TeleportContainer>
          <DataIbcHistory />
        </TeleportContainer>
      </MainContainer>
      <ActionBar stateActionBar={stateActionBar} />
    </HistoryContextProvider>
  );
}

export default Bridge;
