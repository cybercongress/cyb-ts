import {
  AvailableAmount,
  DenomArr,
  InputNumber,
  MainContainer,
} from 'src/components';
import Select, { OptionSelect, SelectOption } from 'src/components/Select';
import { Col, GridContainer } from './comp/grid';
import Slider from './components/slider';
import { CYBER } from 'src/utils/config';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { getBalances, useSetupIbcClient } from './hooks';
import { networkList } from './utils';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import BigNumber from 'bignumber.js';
import { getDisplayAmount } from 'src/utils/utils';

function Bridge() {
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );

  const [tokenSelect, setTokenSelect] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [networkA, setNetworkA] = useState<string>('');
  const [networkB, setNetworkB] = useState<string>(CYBER.CHAIN_ID);

  const { ibcClient, balanceIbc, denomIbc } = useSetupIbcClient(
    tokenSelect,
    networkA
  );

  const reduceOptionsNetwork = (selected: string) => {
    const tempList: SelectOption[] = [];
    let reduceData = {};

    if (selected !== CYBER.CHAIN_ID) {
      reduceData = { [CYBER.CHAIN_ID]: CYBER.CHAIN_ID };
    } else {
      reduceData = { ...networkList };
    }

    Object.keys(reduceData).forEach((key) => {
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
  };

  const reduceOptions = useMemo(() => {
    const tempList: SelectOption[] = [];

    if (totalSupply) {
      Object.keys(totalSupply).forEach((key) => {
        tempList.push({
          value: key,
          text: (
            <DenomArr denomValue={key} onlyText tooltipStatusText={false} />
          ),
          img: <DenomArr denomValue={key} onlyImg tooltipStatusImg={false} />,
        });
      });
    }
    return tempList;
  }, [totalSupply]);

  const useGetAccountBalancesToken = useCallback(
    (selectNetwork: string) => {
      if (selectNetwork !== CYBER.CHAIN_ID) {
        return balanceIbc;
      }

      return accountBalances;
    },
    [accountBalances, balanceIbc]
  );

  const useGetDenomToken = useCallback(
    (selectNetwork: string) => {
      if (selectNetwork !== CYBER.CHAIN_ID && denomIbc) {
        return denomIbc;
      }

      return tokenSelect;
    },
    [tokenSelect, denomIbc]
  );

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

  return (
    <MainContainer width="62%">
      <div
        style={{
          width: '375px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <GridContainer>
          <Col>
            <InputNumber
              value={tokenAmount}
              onValueChange={(value) => setTokenAmount(value)}
              title="choose amount to send"
            />
            <AvailableAmount
              accountBalances={useGetAccountBalancesToken(networkA)}
              token={useGetDenomToken(networkA)}
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
              width="180px"
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
              width="180px"
              title="choose source network"
              options={reduceOptionsNetwork(networkB)}
            />
          </Col>
        </GridContainer>

        <Slider
          tokenA={useGetDenomToken(networkA)}
          tokenAAmount={tokenAmount}
          setPercentageBalanceHook={setPercentageBalanceHook}
          // coinReverseAction={() => tokenChange()}
          accountBalances={useGetAccountBalancesToken(networkA)}
        />

        <GridContainer>
          <AvailableAmount
            accountBalances={useGetAccountBalancesToken(networkB)}
            token={useGetDenomToken(networkB)}
          />

          <Select
            valueSelect={networkB}
            onChangeSelect={(item: string) => setNetworkB(item)}
            width="180px"
            options={reduceOptionsNetwork(networkA)}
            title="destination network"
          />
        </GridContainer>
      </div>
    </MainContainer>
  );
}

export default Bridge;
