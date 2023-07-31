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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
} from 'react';
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
import { Nullable, Option } from 'src/types';
import { ObjKeyValue } from 'src/types/data';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { Col, GridContainer, TeleportContainer } from './comp/grid';
import Slider from './components/slider';
import { getBalances } from './hooks';
import ActionBar from './actionBar.send';
import { getMyTokenBalanceNumber } from './utils';
import DataSendTxs from './comp/dataSendTxs/DataSendTxs';
import useGetSendTxsByAddressByType from './hooks/useGetSendTxsByAddress';
import AccountInput from './comp/Inputs/AccountInput';
import useGetSendTxsByAddressByLcd from './hooks/useGetSendTxsByAddressByLcd';
import { getPassportByNickname } from '../portal/utils';
import citizenship from '../portal/citizenship';
import { Citizenship } from 'src/types/citizenship';
import useDebounce from './useDebounce';
import InputMemo from './comp/Inputs/InputMemo';
import InputNumberDecimalScale from './comp/Inputs/InputNumberDecimalScale';

const tokenDefaultValue = CYBER.DENOM_CYBER;

function Send() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const [recipient, setRecipient] = useState<string>('');
  const [valueRecipient, setValueRecipient] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  // const dataSendTxs = useGetSendTxsByAddressByType(
  //   addressActive,
  //   'cosmos.bank.v1beta1.MsgSend'
  // );
  const dataSendTxs = useGetSendTxsByAddressByLcd(addressActive, recipient);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const [tokenSelect, setTokenSelect] = useState<string>(tokenDefaultValue);
  const [tokenAmount, setTokenAmount] = useState<string>('');

  const [recipientBalances, setRecipientBalances] =
    useState<Option<ObjKeyValue>>(undefined);
  const [memoValue, setMemoValue] = useState<string>('');
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const firstEffectOccured = useRef(false);
  // const deferredRecipient = useDeferredValue(recipient );
  const { debounce } = useDebounce();
  const inputElem = useRef(null);

  useEffect(() => {
    if (firstEffectOccured.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const query = {
        token: tokenSelect,
        recipient: '',
        amount: '',
      };

      if (recipient) {
        query.recipient = recipient;
      }

      if (Number(tokenAmount) > 0) {
        query.amount = tokenAmount;
      }

      setSearchParams(createSearchParams(query));
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { token, recipient, amount } = param;
        setTokenSelect(token);
        if (recipient) {
          setValueRecipient(recipient);
          handleSearch(recipient);
        }

        if (amount && Number(amount) > 0) {
          setTokenAmount(amount);
        }
      }
    }
  }, [tokenSelect, recipient, setSearchParams, searchParams, tokenAmount]);

  const validInputAmountToken = useMemo(() => {
    if (traseDenom) {
      const myATokenBalance = getMyTokenBalanceNumber(
        tokenSelect,
        accountBalances
      );

      if (Number(tokenAmount) > 0) {
        const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenSelect);

        const amountToken = parseFloat(
          getDisplayAmountReverce(tokenAmount, coinDecimalsA)
        );

        return amountToken > myATokenBalance;
      }
    }
    return false;
  }, [tokenAmount, tokenSelect, traseDenom, accountBalances]);

  useEffect(() => {
    // valid send
    let exceeded = true;

    const validTokenAmount = !validInputAmountToken && Number(tokenAmount) > 0;
    const validRecipient = recipient && recipient.match(PATTERN_CYBER);

    if (validRecipient && validTokenAmount) {
      exceeded = false;
    }

    setIsExceeded(exceeded);
  }, [recipient, validInputAmountToken, tokenAmount]);

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

  const reverceTokenAmount = useMemo(() => {
    return new BigNumber(tokenAmount).multipliedBy(-1).toString();
  }, [tokenAmount]);

  const stateActionBar = {
    tokenAmount,
    tokenSelect,
    recipient,
    updateFunc,
    isExceeded,
    memoValue,
  };

  const getRecipient = useCallback(
    async (value: string) => {
      if (!value) {
        setRecipient(undefined);
        return;
      }

      if (value.match(PATTERN_CYBER)) {
        setRecipient(value);
      } else {
        const response = await getPassportByNickname(queryClient, value);

        console.log('response', response);

        if (response) {
          setRecipient(response.owner);
          return;
        }
        setRecipient(undefined);
      }
    },
    [queryClient]
  );

  const handleSearch = useCallback(
    debounce((inputVal) => getRecipient(inputVal), 500),
    []
  );

  const onChangeRecipient = useCallback((inputVal) => {
    setValueRecipient(inputVal);
    handleSearch(inputElem.current?.value);
  }, []);

  return (
    <>
      <MainContainer width="62%">
        <TeleportContainer>
          <AccountInput
            ref={inputElem}
            valueRecipient={valueRecipient}
            recipient={recipient}
            onChangeRecipient={onChangeRecipient}
          />
          <InputMemo value={memoValue} onChangeValue={setMemoValue} />
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
                accountBalances={accountBalances}
                token={tokenSelect}
                title="you will have"
                changeAmount={reverceTokenAmount}
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
              <AvailableAmount
                title="recipient have"
                accountBalances={recipientBalances}
                token={tokenSelect}
                changeAmount={tokenAmount}
              />
            </Col>
          </GridContainer>

          <Slider
            tokenA={tokenSelect}
            tokenAAmount={tokenAmount}
            setPercentageBalanceHook={setPercentageBalanceHook}
            accountBalances={accountBalances}
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
