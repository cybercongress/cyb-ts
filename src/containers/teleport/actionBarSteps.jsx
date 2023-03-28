import React from 'react';
import { ActionBar as ActionBarContainer } from '@cybercongress/gravity';
import { LEDGER } from '../../utils/config';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
} from '../../components';

const { STAGE_ERROR, STAGE_SUBMITTED, STAGE_CONFIRMING, STAGE_CONFIRMED } =
  LEDGER;

function ActionBarStaps({ stageActionBarStaps }) {
  const { stage, cleatState, txHash, txHeight, errorMessage } =
    stageActionBarStaps;

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

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBarStaps;
