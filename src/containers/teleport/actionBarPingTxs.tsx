import { ActionBar as ActionBarContainer } from '@cybercongress/gravity';
import { useQueryClient } from 'src/contexts/queryClient';
import { useEffect, useState } from 'react';
import { Option } from 'src/types';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
} from '../../components';
import { LEDGER } from '../../utils/config';

const { STAGE_ERROR, STAGE_SUBMITTED, STAGE_CONFIRMING, STAGE_CONFIRMED } =
  LEDGER;

function ActionBarPingTxs({ stageActionBarStaps }) {
  const queryClient = useQueryClient();
  const [txHeight, setTxHeight] = useState<Option<number>>(undefined);
  const [errorMessage, setErrorMessage] =
    useState<Option<string | JSX.Element>>(undefined);

  const { stage, setStage, cleatState, txHash, errorMessageProps, updateFunc } =
    stageActionBarStaps;

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash) {
        setStage(STAGE_CONFIRMING);
        const response = await queryClient.getTx(txHash);
        if (response !== null) {
          if (response.code === 0) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFunc) {
              updateFunc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, txHash]);

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBarContainer>
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
        onClickBtnCloce={() => cleatState()}
      />
    );
  }

  if ((stage === STAGE_ERROR && errorMessage !== null) || errorMessageProps) {
    return (
      <TransactionError
        errorMessage={errorMessage || errorMessageProps}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBarPingTxs;
