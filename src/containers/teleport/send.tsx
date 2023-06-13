import {
  AvailableAmount,
  DenomArr,
  Input,
  InputNumber,
  MainContainer,
  Select,
} from 'src/components';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { RootState } from 'src/redux/store';
import { useSelector } from 'react-redux';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CYBER, PATTERN_CYBER } from 'src/utils/config';
import { useQueryClient } from 'src/contexts/queryClient';
import { getDisplayAmount, reduceBalances } from 'src/utils/utils';
import { OptionSelect, SelectOption } from 'src/components/Select';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import BigNumber from 'bignumber.js';
import { Col, GridContainer } from './comp/grid';
import Slider from './components/slider';
import { getBalances } from './hooks';

const tokenDefaultValue = CYBER.DENOM_CYBER;

function Send() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const [tokenSelect, setTokenSelect] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [recipientBalances, setRecipientBalances] = useState(undefined);
  const [memoValue, setMemoValue] = useState('');

  useEffect(() => {
    setTokenAmount('');
  }, [tokenSelect]);

  useEffect(() => {
    const getBalancesRecipient = async () => {
      setRecipientBalances(undefined);
      if (queryClient && recipient && recipient.match(PATTERN_CYBER)) {
        const getAllBalancesPromise = await queryClient.getAllBalances(
          recipient
        );
        console.log('getAllBalancesPromise', getAllBalancesPromise);
        const dataReduceBalances = reduceBalances(getAllBalancesPromise);
        setRecipientBalances(dataReduceBalances);
      }
    };
    getBalancesRecipient();
  }, [queryClient, recipient, update]);

  const reduceOptions = useMemo(() => {
    const tempList: SelectOption[] = [];

    if (accountBalances) {
      Object.keys(accountBalances).forEach((key) => {
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
  }, [accountBalances]);

  const setPercentageBalanceHook = useCallback(
    (value: number) => {
      if (
        accountBalances &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenSelect) &&
        traseDenom
      ) {
        const [{ coinDecimals }] = traseDenom(tokenSelect);
        const amount = new BigNumber(accountBalances[tokenSelect])
          .multipliedBy(value)
          .dividedBy(100)
          .dp(coinDecimals, BigNumber.ROUND_FLOOR)
          .toNumber();
        const amount1 = getDisplayAmount(amount, coinDecimals);
        setTokenAmount(amount1);
      }
    },
    [accountBalances, tokenSelect, traseDenom]
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
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          title="choose recipient"
          color={Color.Yellow}
        />
        <GridContainer>
          <Col>
            <InputNumber
              value={tokenAmount}
              onValueChange={(value) => setTokenAmount(value)}
              title="choose amount to send"
            />
            <AvailableAmount
              accountBalances={accountBalances}
              token={tokenSelect}
              title="you have"
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
            <AvailableAmount
              title="recipient have"
              accountBalances={recipientBalances}
              token={tokenSelect}
            />
          </Col>
        </GridContainer>

        <Slider
          tokenA={tokenSelect}
          tokenAAmount={tokenAmount}
          setPercentageBalanceHook={setPercentageBalanceHook}
          accountBalances={accountBalances}
        />

        <Input
          value={memoValue}
          onChange={(e) => setMemoValue(e.target.value)}
          title="type public message"
          color={Color.Pink}
        />
      </div>
    </MainContainer>
  );
}

export default Send;
