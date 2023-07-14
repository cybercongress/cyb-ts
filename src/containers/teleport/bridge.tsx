import {
  AvailableAmount,
  DenomArr,
  InputNumber,
  MainContainer,
} from 'src/components';
import Select, { OptionSelect, SelectOption } from 'src/components/Select';
import { CYBER } from 'src/utils/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import BigNumber from 'bignumber.js';
import { getDisplayAmount, getDisplayAmountReverce } from 'src/utils/utils';
import { getMyTokenBalanceNumber, networkList } from './utils';
import { getBalances, useSetupIbcClient } from './hooks';
import Slider from './components/slider';
import { Col, GridContainer, TeleportContainer } from './comp/grid';
import { TypeTxsT } from './type';
import ActionBar from './actionBar.bridge';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useChannels } from 'src/hooks/useHub';
import HistoryContextProvider from './ibc-history/historyContext';
import DataIbcHistory from './comp/dataIbcHistory/DataIbcHistory';
import { Networks } from 'src/types/networks';

function Bridge() {
  const { traseDenom } = useIbcDenom();
  const { channels } = useChannels();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { totalSupplyAll: totalSupply } = useGetTotalSupply();
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [tokenSelect, setTokenSelect] = useState<string>(CYBER.DENOM_LIQUID_TOKEN);
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
      const query = {
        networkFrom: networkA,
        networkTo: networkB,
        token: tokenSelect,
      };

      setSearchParams(createSearchParams(query));
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { networkFrom, networkTo, token } = param;
        setNetworkA(networkFrom);
        setNetworkB(networkTo);
        setTokenSelect(token);
      }
    }
  }, [networkA, networkB, tokenSelect, setSearchParams, searchParams]);

  useEffect(() => {
    if (
      channels &&
      networkA &&
      networkB &&
      networkA !== CYBER.CHAIN_ID &&
      networkB === CYBER.CHAIN_ID
    ) {
      setTypeTxs('deposit');
      const { destination_channel_id: destChannelId } = channels[networkA];
      setSourceChannel(destChannelId);
    }

    if (
      channels &&
      networkA &&
      networkB &&
      networkA === CYBER.CHAIN_ID &&
      networkB !== CYBER.CHAIN_ID
    ) {
      setTypeTxs('withdraw');

      const { source_channel_id: sourceChannelId } = channels[networkB];
      setSourceChannel(sourceChannelId);
    }
  }, [networkB, networkA, channels]);

  const reduceOptionsNetwork = useCallback(
    (selected: string) => {
      const tempList: SelectOption[] = [];
      let reduceData: string[] = [];

      if (channels) {
        reduceData = [CYBER.CHAIN_ID, ...Object.keys(channels)];
      }

      reduceData.forEach((key) => {
        tempList.push({
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
        });
      });
      return tempList;
    },
    [channels]
  );

  const reduceOptions = useMemo(() => {
    const tempList: SelectOption[] = [];

    if (totalSupply) {
      Object.keys(totalSupply).forEach((key) => {
        tempList.push({
          value: key,
          text: <DenomArr denomValue={key} onlyText />,
          img: <DenomArr denomValue={key} onlyImg tooltipStatusImg={false} />,
        });
      });
    }
    return tempList;
  }, [totalSupply]);

  const getAccountBalancesToken = useCallback(
    (selectNetwork: string) => {
      if (selectNetwork !== CYBER.CHAIN_ID) {
        return balanceIbc;
      }

      return accountBalances;
    },
    [accountBalances, balanceIbc]
  );

  const getDenomToken = useCallback(
    (selectNetwork: string) => {
      if (selectNetwork !== CYBER.CHAIN_ID && denomIbc) {
        return denomIbc;
      }

      return tokenSelect;
    },
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
    // validation bridge
    let exceeded = true;

    const validNetwork =
      networkA.length > 0 && networkB.length > 0 && networkA !== networkB;

    // check set up ibc cliet for deposit
    const validIbcClient = typeTxs === 'deposit' ? ibcClient !== null : true;

    const validTokenAmount = !validInputAmountToken && Number(tokenAmount) > 0;

    if (validNetwork && validIbcClient && validTokenAmount) {
      exceeded = false;
    }

    setIsExceeded(exceeded);
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

      if (networkA !== CYBER.CHAIN_ID && denomIbc) {
        tokenA = denomIbc;
        accountBalancesA = balanceIbc;
      }
      if (networkA === CYBER.CHAIN_ID) {
        tokenA = tokenSelect;
        accountBalancesA = accountBalances;
      }

      if (
        accountBalancesA &&
        tokenA &&
        Object.prototype.hasOwnProperty.call(accountBalancesA, tokenA) &&
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

  const updateFunc = () => {
    setUpdate((item) => item + 1);
  };

  function tokenChange() {
    const A = networkB;
    const B = networkA;

    setNetworkA(A);
    setNetworkB(B);
  }

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

  return (
    <HistoryContextProvider>
      <MainContainer width="62%">
        <TeleportContainer>
          <GridContainer>
            <Col>
              <InputNumber
                value={tokenAmount}
                onValueChange={(value) => setTokenAmount(value)}
                title="choose amount to send"
                color={validInputAmountToken ? Color.Pink : undefined}
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
            tokenA={getDenomToken(networkA)}
            tokenAAmount={tokenAmount}
            setPercentageBalanceHook={setPercentageBalanceHook}
            coinReverseAction={() => tokenChange()}
            accountBalances={getAccountBalancesToken(networkA)}
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
