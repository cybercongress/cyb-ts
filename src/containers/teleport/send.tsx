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
import {
  getDisplayAmount,
  getDisplayAmountReverce,
  reduceBalances,
} from 'src/utils/utils';
import { OptionSelect, SelectOption } from 'src/components/Select';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import BigNumber from 'bignumber.js';
import { Option } from 'src/types';
import { ObjKeyValue } from 'src/types/data';
import { Col, GridContainer, TeleportContainer } from './comp/grid';
import Slider from './components/slider';
import { getBalances } from './hooks';
import ActionBar from './actionBar.send';
import { getMyTokenBalanceNumber } from './utils';
import DataSendTxs from './comp/dataSendTxs/DataSendTxs';
import useGetSendTxsByAddressByType from './hooks/useGetSendTxsByAddress';

const tokenDefaultValue = CYBER.DENOM_CYBER;

function Send() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const dataSendTxs = useGetSendTxsByAddressByType(
    addressActive,
    'cosmos.bank.v1beta1.MsgSend'
  );
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const [tokenSelect, setTokenSelect] = useState<string>(tokenDefaultValue);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [recipientBalances, setRecipientBalances] =
    useState<Option<ObjKeyValue>>(undefined);
  const [memoValue, setMemoValue] = useState<string>('');
  const [isExceeded, setIsExceeded] = useState<boolean>(false);

  useEffect(() => {
    setTokenAmount('');
  }, [tokenSelect]);

  useEffect(() => {
    // valid send
    let exceeded = true;
    const myATokenBalance = getMyTokenBalanceNumber(
      tokenSelect,
      accountBalances
    );

    const [{ coinDecimals }] = traseDenom(tokenSelect);

    const validTokenAmount =
      parseFloat(getDisplayAmountReverce(tokenAmount, coinDecimals)) <=
        myATokenBalance && myATokenBalance > 0;
    const validRecipient = recipient.match(PATTERN_CYBER);

    if (validRecipient && validTokenAmount) {
      exceeded = false;
    }

    setIsExceeded(exceeded);
  }, [recipient, tokenSelect, accountBalances, tokenAmount, traseDenom]);

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

  const updateFunc = useCallback(() => {
    setUpdate((item) => item + 1);
    dataSendTxs.refetch();
  }, [dataSendTxs]);

  const stateActionBar = {
    tokenAmount,
    tokenSelect,
    recipient,
    updateFunc,
    isExceeded,
    memoValue,
  };

  return (
    <>
      <MainContainer width="62%">
        <TeleportContainer>
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
        </TeleportContainer>
        <TeleportContainer>
          <DataSendTxs dataSendTxs={dataSendTxs} accountUser={addressActive} />
        </TeleportContainer>
      </MainContainer>
      <ActionBar stateActionBar={stateActionBar} />
    </>
  );
}

export default Send;
