import { useEffect, useState } from 'react';
import { coin } from '@cosmjs/launchpad';
import { Link } from 'react-router-dom';
import { useSigningClient } from 'src/contexts/signerClient';
import { useQueryClient } from 'src/contexts/queryClient';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  Account,
  ActionBar as ActionBarContainer,
  BtnGrd,
} from '../../components';
import { CYBER, LEDGER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import { getTxs } from '../../utils/search/utils';

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const BASE_VESTING_TIME = 86401;

function ActionBar({
  value,
  selected,
  valueDays,
  resourceToken,
  updateFnc,
  addressActive,
}) {
  const queryClient = useQueryClient();
  const { signer, signingClient } = useSigningClient();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);

        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFnc) {
              updateFnc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signingClient, txHash]);

  const investmint = async () => {
    if (signer && signingClient) {
      setStage(STAGE_SUBMITTED);
      const [{ address }] = await signer.getAccounts();
      const gas = DEFAULT_GAS_LIMITS * 2;
      const fee = {
        amount: [],
        gas: gas.toString(),
      };
      if (addressActive === address) {
        try {
          const response = await signingClient.investmint(
            address,
            coin(parseFloat(value), CYBER.DENOM_LIQUID_TOKEN),
            selected,
            parseFloat(BASE_VESTING_TIME * valueDays),
            fee
          );

          if (response.code === 0) {
            setTxHash(response.transactionHash);
          } else if (response.code === 4) {
            setTxHash(null);
            setErrorMessage(
              'Cyberlinking and investmint is not working. Wait for updates.'
            );
            setStage(STAGE_ERROR);
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
    }
  };

  const clearState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
  };

  if (stage === STAGE_INIT) {
    return (
      <ActionBarContainer
        button={{
          text: 'Investmint',
          onClick: investmint,
          disabled: resourceToken === 0,
        }}
      />
    );
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBarContainer
        text={
          <>
            check the transaction <Dots big />
          </>
        }
      />
    );
  }

  if (stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnClose={() => clearState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => clearState()}
      />
    );
  }

  return <ActionBarContainer />;
}

export default ActionBar;
