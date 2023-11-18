import {
  AvailableAmount,
  DenomArr,
  MainContainer,
  Select,
  Slider,
} from 'src/components';
import { RootState } from 'src/redux/store';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from 'src/redux/hooks';

import useAccountsPassports from 'src/features/passport/hooks/useAccountsPassports';
import Slider from 'src/components/Slider/Slider';
import { Col, GridContainer, TeleportContainer } from '../../components/grid';
import ActionBar from './actionBar.send';
import { getMyTokenBalanceNumber } from '../../utils';
import DataSendTxs from '../../components/dataSendTxs/DataSendTxs';
import AccountInput from '../../components/Inputs/AccountInput';
import useGetSendTxsByAddressByLcd from '../../hooks/useGetSendTxsByAddressByLcd';
import InputMemo from '../../components/Inputs/InputMemo';
import InputNumberDecimalScale from '../../components/Inputs/InputNumberDecimalScale';
import { useTeleport } from '../Teleport.context';

const tokenDefaultValue = CYBER.DENOM_CYBER;

function Send() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useAppSelector((state: RootState) => state.pocket);
  useAccountsPassports();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { accountBalances, refreshBalances } = useTeleport();
  const [update, setUpdate] = useState(0);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  // const dataSendTxs = useGetSendTxsByAddressByType(
  //   addressActive,
  //   'cosmos.bank.v1beta1.MsgSend'
  // );
  const dataSendTxs = useGetSendTxsByAddressByLcd(addressActive, recipient);
  const [tokenSelect, setTokenSelect] = useState<string>(tokenDefaultValue);
  const [tokenAmount, setTokenAmount] = useState<string>('');

  const [recipientBalances, setRecipientBalances] =
    useState<Option<ObjKeyValue>>(undefined);
  const [memoValue, setMemoValue] = useState<string>('');
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const firstEffectOccured = useRef(false);

  const [tokenACoinDecimals, setTokenACoinDecimals] = useState<number>(0);
  const [tokenABalance, setTokenABalance] = useState<number>(0);

  // const deferredRecipient = useDeferredValue(recipient );

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

      setSearchParams(createSearchParams(query), { replace: true });
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { token, recipient, amount } = param;
        setTokenSelect(token);
        if (recipient) {
          setRecipient(recipient);
        }

        if (amount && Number(amount) > 0) {
          setTokenAmount(amount);
        }
      }
    }
  }, [tokenSelect, recipient, setSearchParams, searchParams, tokenAmount]);

  useEffect(() => {
    const [{ coinDecimals }] = traseDenom(tokenSelect);
    setTokenACoinDecimals(coinDecimals);
  }, [tokenSelect, traseDenom]);

  // setTokenABalance
  useEffect(() => {
    if (accountBalances) {
      setTokenABalance(accountBalances[tokenSelect] || 0);
    }
  }, [tokenSelect, accountBalances]);

  const validInputAmountToken = useMemo(() => {
    const myATokenBalance = getMyTokenBalanceNumber(
      tokenSelect,
      accountBalances
    );

    if (Number(tokenAmount) > 0) {
      const amountToken = parseFloat(
        getDisplayAmountReverce(tokenAmount, tokenACoinDecimals)
      );

      return amountToken > myATokenBalance;
    }

    return false;
  }, [tokenAmount, tokenSelect, accountBalances, tokenACoinDecimals]);

  useEffect(() => {
    const validTokenAmount = !validInputAmountToken && Number(tokenAmount) > 0;
    const validRecipient = recipient && recipient.match(PATTERN_CYBER);

    setIsExceeded(!(validRecipient && validTokenAmount));
  }, [recipient, validInputAmountToken, tokenAmount]);

  useEffect(() => {
    const getBalancesRecipient = async () => {
      setRecipientBalances(undefined);
      if (queryClient && recipient && recipient.match(PATTERN_CYBER)) {
        const getAllBalancesPromise = await queryClient.getAllBalances(
          recipient
        );
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
      if (tokenABalance) {
        const amount = new BigNumber(tokenABalance)
          .multipliedBy(value)
          .dividedBy(100)
          .dp(tokenACoinDecimals, BigNumber.ROUND_FLOOR)
          .toNumber();

        setTokenAmount(getDisplayAmount(amount, tokenACoinDecimals));
      }
    },
    [tokenABalance, tokenSelect, tokenACoinDecimals]
  );

  const getPercentsOfToken = useCallback(() => {
    const amountTokenA = getDisplayAmountReverce(
      tokenAmount,
      tokenACoinDecimals
    );

    return tokenABalance > 0
      ? new BigNumber(amountTokenA)
          .dividedBy(tokenABalance)
          .multipliedBy(100)
          .toNumber()
      : 0;
  }, [tokenSelect, tokenAmount, tokenABalance, tokenACoinDecimals]);

  const updateFunc = useCallback(() => {
    setUpdate((item) => item + 1);
    dataSendTxs.refetch();
    refreshBalances();
  }, [dataSendTxs, refreshBalances]);

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

  return (
    <>
      <MainContainer width="62%">
        <TeleportContainer>
          <Select
            valueSelect={CYBER.CHAIN_ID}
            currentValue={CYBER.CHAIN_ID}
            disabled
            options={[
              {
                value: CYBER.CHAIN_ID,
                text: CYBER.CHAIN_ID,
                img: (
                  <DenomArr
                    denomValue={CYBER.CHAIN_ID}
                    onlyImg
                    type="network"
                    tooltipStatusImg={false}
                  />
                ),
              },
            ]}
            width="100%"
            // disabled
            title="choose network"
          />
          <InputMemo value={memoValue} onChangeValue={setMemoValue} />
          <AccountInput recipient={recipient} setRecipient={setRecipient} />
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
                title={tokenAmount.length === 0 ? 'you have' : 'you will have'}
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
                title={
                  tokenAmount.length === 0
                    ? 'recipient have'
                    : 'recipient will have'
                }
                accountBalances={recipientBalances}
                token={tokenSelect}
                changeAmount={tokenAmount}
              />
            </Col>
          </GridContainer>

          <Slider
            valuePercents={getPercentsOfToken()}
            onChange={setPercentageBalanceHook}
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
