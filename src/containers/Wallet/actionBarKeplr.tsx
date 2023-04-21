import { useEffect, useState } from 'react';
import { Pane, ActionBar, Input } from '@cybercongress/gravity';
import { coins } from '@cosmjs/launchpad';
import { useSigningClient } from 'src/contexts/signerClient';
import Button from 'src/components/btnGrd';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  ActionBarSend,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_CYBER,
  DEFAULT_GAS_LIMITS,
} from '../../utils/config';
import { getTxs } from '../../utils/search/utils';

const { STAGE_ERROR, STAGE_SUBMITTED, STAGE_CONFIRMING, STAGE_CONFIRMED } =
  LEDGER;

const STAGE_SEND = 1.1;

function ActionBarKeplr({ updateAddress, updateBalance, onClickBack }) {
  const { signer, signingClient } = useSigningClient();
  const [stage, setStage] = useState(STAGE_SEND);
  const [amountSend, setAmountSend] = useState('');
  const [recipient, setRecipient] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [disabledGenerate, setDisabledGenerate] = useState(true);

  const generateTxSend = async () => {
    const amount = parseFloat(amountSend);
    if (signer && signingClient) {
      setStage(STAGE_SUBMITTED);
      const [{ address }] = await signer.getAccounts();
      const fee = {
        amount: [],
        gas: (DEFAULT_GAS_LIMITS * 2).toString(),
      };
      const result = await signingClient.sendTokens(
        address,
        recipient,
        coins(amount, CYBER.DENOM_CYBER),
        fee
      );
      console.log('result: ', result);
      const hash = result.transactionHash;
      console.log('hash :>> ', hash);
      setTxHash(hash);
    }
  };

  const cleatState = () => {
    setStage(STAGE_SEND);
    setRecipient('');
    setAmountSend('');
    setErrorMessage(null);
    setTxHeight(null);
    setTxHash(null);
    if (updateAddress) {
      updateAddress();
    }
  };

  useEffect(() => {
    const confirmTx = async () => {
      console.log('txHash :>> ', txHash);
      if (txHash && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateBalance) {
              updateBalance();
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
  }, [txHash]);

  useEffect(() => {
    if (recipient.match(PATTERN_CYBER) && parseFloat(amountSend) > 0) {
      setDisabledGenerate(false);
    } else {
      setDisabledGenerate(true);
    }
  }, [recipient, amountSend]);

  const amountChangeHandler = (values: string) => {
    setAmountSend(values);
  };

  if (stage === STAGE_SEND) {
    return (
      <ActionBarSend
        onClickBtn={() => generateTxSend()}
        onChangeInputAmount={amountChangeHandler}
        valueInputAmount={amountSend}
        valueInputAddressTo={recipient}
        onChangeInputAddressTo={(e) => setRecipient(e.target.value)}
        disabledBtn={disabledGenerate}
        onClickBack={onClickBack}
      />
    );
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBar>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBar>
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

export default ActionBarKeplr;
