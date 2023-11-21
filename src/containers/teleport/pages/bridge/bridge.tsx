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
import {
  Col,
  GridContainer,
  TeleportContainer,
} from '../../components/containers/Containers';
import { TypeTxsT } from '../../type';
import ActionBar from './actionBar.bridge';
import HistoryContextProvider from '../../ibc-history/historyContext';
import DataIbcHistory from '../../components/dataIbcHistory/DataIbcHistory';
import InputNumberDecimalScale from '../../components/Inputs/InputNumberDecimalScale/InputNumberDecimalScale';
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

  const [tokenA, setTokenA] = useState<string>('');

  const [tokenABalance, setTokenABalance] = useState<number>(0);
  const [tokenBBalance, setTokenBBalance] = useState<number>(0);

  const [tokenACoinDecimals, setTokenACoinDecimals] = useState<number>(0);

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

  const networkOptions = useCallback(
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

  const tokenOptions = useMemo(
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

  const validInputAmountToken = useMemo(() => {
    if (tokenA) {
      const myATokenBalance = getMyTokenBalanceNumber(tokenA, tokenABalance);

      if (Number(tokenAmount) > 0) {
        const amountToken = parseFloat(
          getDisplayAmountReverce(tokenAmount, tokenACoinDecimals)
        );

        return amountToken > myATokenBalance;
      }
    }
    return false;
  }, [tokenAmount, tokenA, tokenACoinDecimals]);

  useEffect(() => {
    const validNetwork = networkA && networkB && networkA !== networkB;

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
      const amount = new BigNumber(tokenABalance)
        .multipliedBy(value)
        .dividedBy(100)
        .dp(tokenACoinDecimals, BigNumber.ROUND_FLOOR)
        .toNumber();
      setTokenAmount(getDisplayAmount(amount, tokenACoinDecimals));
    },
    [tokenABalance, tokenACoinDecimals]
  );

  const getPercentsOfToken = useCallback(() => {
    return tokenABalance > 0
      ? new BigNumber(getDisplayAmountReverce(tokenAmount, tokenACoinDecimals))
          .dividedBy(tokenABalance)
          .multipliedBy(100)
          .toNumber()
      : 0;
  }, [tokenAmount, tokenACoinDecimals, tokenABalance]);

  const tokenChange = useCallback(() => {
    setNetworkA(networkB);
    setNetworkB(networkA);
    setTokenAmount(0);
  }, [networkB, networkA]);

  useEffect(() => {
    const tokenA = !isCyberChain(networkA) && denomIbc ? denomIbc : tokenSelect;
    setTokenA(tokenA);
    const [{ coinDecimals }] = traseDenom(tokenA);
    setTokenACoinDecimals(coinDecimals);
  }, [networkA, traseDenom, denomIbc, tokenSelect]);

  const getAccountBalancesToken = useCallback(
    (selectNetwork: string) =>
      !isCyberChain(selectNetwork) ? balanceIbc : accountBalances,
    [accountBalances, balanceIbc]
  );

  useEffect(() => {
    const balance = getAccountBalancesToken(networkA);
    const balanceToken = balance ? balance[tokenA] || 0 : 0;
    setTokenABalance(balanceToken);
  }, [getAccountBalancesToken, networkA, tokenA]);

  useEffect(() => {
    const balance = getAccountBalancesToken(networkB);
    const balanceToken = balance ? balance[tokenA] || 0 : 0;
    setTokenBBalance(balanceToken);
  }, [getAccountBalancesToken, networkB, tokenA]);

  const stateActionBar = {
    tokenAmount,
    tokenSelect,
    updateFunc: () => refreshBalances(),
    isExceeded,
    typeTxs,
    ibcClient,
    denomIbc,
    sourceChannel,
    networkB,
  };

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
                amountToken={getDisplayAmount(
                  tokenABalance,
                  tokenACoinDecimals
                )}
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
                options={tokenOptions}
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
                options={networkOptions()}
              />
            </Col>
          </GridContainer>

          <Slider
            valuePercents={getPercentsOfToken()}
            onChange={setPercentageBalanceHook}
            onSwapClick={tokenChange}
            disabled={tokenABalance === 0}
          />

          <GridContainer>
            <AvailableAmount
              amountToken={getDisplayAmount(tokenBBalance, tokenACoinDecimals)}
            />
            <Select
              valueSelect={networkB}
              onChangeSelect={(item: string) => setNetworkB(item)}
              width="100%"
              options={networkOptions()}
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
