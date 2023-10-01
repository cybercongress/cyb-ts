import { useEffect, useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import Long from 'long';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from 'src/contexts/signerClient';
import { Option } from 'src/types';
import { useSelector } from 'react-redux';
import { Coin } from '@cosmjs/launchpad';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import {
  ActionBarContentText,
  Account,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../../../components';
import { DEFAULT_GAS_LIMITS, LEDGER } from '../../../../utils/config';
import {
  fromBech32,
  trimString,
  convertAmountReverce,
  convertAmount,
} from '../../../../utils/utils';
import networks from '../../../../utils/networkListIbc';

import { TxsType } from '../../type';
import { RootState } from 'src/redux/store';
import ActionBarPingTxs from '../../comp/actionBarPingTxs';

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

const coinFunc = (amount: number, denom: string): Coin => {
  return { denom, amount: new BigNumber(amount).toString(10) };
};

function ActionBar({ stateActionBar }) {
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { signingClient, signer } = useSigningClient();
  const { traseDenom } = useIbcDenom();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState<Option<string>>(undefined);
  const [errorMessage, setErrorMessage] =
    useState<Option<string | JSX.Element>>(undefined);

  const {
    tokenAmount,
    tokenSelect,
    recipient,
    updateFunc,
    isExceeded,
    memoValue,
  } = stateActionBar;

  const sendOnClick = async () => {
    if (signer && signingClient && traseDenom) {
      const [{ address }] = await signer.getAccounts();

      let amountTokenA = tokenAmount;

      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenSelect);

      amountTokenA = convertAmountReverce(amountTokenA, coinDecimalsA);

      setStage(STAGE_SUBMITTED);

      const offerCoin = [coinFunc(parseFloat(amountTokenA), tokenSelect)];
      const recipientAddress = recipient;

      if (addressActive !== null && addressActive.bech32 === address) {
        try {
          const response = await signingClient.sendTokens(
            address,
            recipientAddress,
            offerCoin,
            'auto',
            memoValue
          );

          if (response.code === 0) {
            setTxHash(response.transactionHash);
          } else {
            setTxHash(undefined);
            setStage(STAGE_ERROR);
            setErrorMessage(response.rawLog.toString());
          }
        } catch (error) {
          setTxHash(undefined);
          setStage(STAGE_ERROR);

          setErrorMessage(error.toString());
        }
      } else {
        setStage(STAGE_ERROR);
        setErrorMessage(
          <span>
            Add address <Account margin="0 5px" address={address} /> to your
            pocket or make active{' '}
          </span>
        );
      }
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(undefined);
    setErrorMessage(undefined);
  };

  if (stage === STAGE_INIT) {
    return (
      <ActionBarCenter
        button={{
          text: 'Send',
          onClick: sendOnClick,
          disabled: isExceeded,
        }}
      />
    );
  }

  const stageActionBarStaps = {
    stage,
    setStage,
    cleatState,
    updateFunc,
    txHash,
    errorMessageProps: errorMessage,
  };

  return <ActionBarPingTxs stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
