import { ActionBar, Button, Input, InputNumber } from 'src/components';
import { routes } from 'src/routes';
import { isBostromAddress } from '../utils';
import { log } from 'tone/build/esm/core/util/Debug';
import { useEffect, useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { AdviserProps } from '../Sense';
import { CYBER } from 'src/utils/config';
import { coin } from '@cosmjs/launchpad';
import { addSenseItem, updateSenseItem } from '../../redux/sense.redux';
import { SenseMetaType } from 'src/services/backend/types/sense';
import styles from './ActionBar.module.scss';

type Props = {
  id: string | undefined;
  update: () => void;
} & AdviserProps;

enum STEPS {
  INITIAL,
  MESSAGE,
  AMOUNT,
}

function ActionBarWrapper({ id, adviser, update }: Props) {
  const [step, setStep] = useState(STEPS.INITIAL);

  const [message, setMessage] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const address = useAppSelector(selectCurrentAddress);
  const dispatch = useAppDispatch();

  const [tx, setTx] = useState({
    hash: '',
    onSuccess: null,
  });

  const waitForTransaction = useWaitForTransaction(tx);

  useEffect(() => {
    const { error, isLoading } = waitForTransaction;

    adviser.setLoading(isLoading);

    if (error) {
      adviser.setError(error);

      if (!id || !tx.hash) {
        return;
      }

      dispatch(
        updateSenseItem({
          chatId: id!,
          txHash: tx.hash,
          isSuccess: false,
        })
      );
    }
  }, [waitForTransaction, dispatch, adviser, id, tx.hash]);

  const { signingClient, signer } = useSigningClient();

  const signerIsReady = Boolean(signer && signingClient);

  useEffect(() => {
    setStep(STEPS.INITIAL);
    setMessage('');
    setAmount(0);
  }, [id]);

  async function send() {
    if (!signerIsReady || !address) {
      return;
    }

    if (!(message || amount)) {
      adviser.setError('Message or amount is empty');
      adviser.setAdviserText('Message or amount is empty');
      return;
    }

    try {
      const formattedAmount = [coin(amount || 1, CYBER.DENOM_CYBER)];
      adviser.setLoading(true);

      adviser.setAdviserText('Preparing transaction...');

      const response = await signingClient!.sendTokens(
        address,
        id!,
        formattedAmount,
        'auto',
        message
      );

      if (response.code !== 0) {
        throw new Error(response.rawLog);
      }

      const txHash = response.transactionHash;

      dispatch(
        addSenseItem({
          id: id!,
          item: {
            memo: message,
            meta: {
              amount: formattedAmount,
            },
            itemType: SenseMetaType.send,
            id: address,
            address,
            hash: txHash,
            timestamp: Date.now(),
          },
        })
      );

      adviser.setAdviserText('Confirming transaction...');
      setTx({
        hash: txHash,
        onSuccess: () => {
          // update();

          dispatch(
            updateSenseItem({
              chatId: id!,
              txHash,
              isSuccess: true,
            })
          );

          setStep(STEPS.INITIAL);
          setMessage('');
          setAmount(0);

          adviser.setLoading(false);
          adviser.setAdviserText('Message sent!');

          setTimeout(() => {
            adviser.setAdviserText('');
          }, 5000);
        },
      });
    } catch (error) {
      adviser.setLoading(false);

      if (error.message === 'Request rejected') {
        adviser.setAdviserText('');
        return;
      }
      console.dir(error);
      adviser.setError(error.message);
      adviser.setAdviserText(error.message);
    }
  }

  if (!(id && isBostromAddress(id))) {
    return null;
  }

  if (step === STEPS.INITIAL) {
    return (
      <ActionBar
        button={{
          text: 'Send message',
          onClick: () => {
            setStep(STEPS.MESSAGE);
          },
        }}
      />
    );
  }

  if (step === STEPS.MESSAGE) {
    return (
      <ActionBar
        onClickBack={() => {
          setStep(STEPS.INITIAL);
        }}
      >
        <Input
          classNameTextbox={styles.messageInput}
          isTextarea
          autoFocus
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Message"
        />
        <Button onClick={send}>Confirm</Button>
        <span>or</span>
        <Button onClick={() => setStep(STEPS.AMOUNT)}>Send tokens</Button>
      </ActionBar>
    );
  }

  if (step === STEPS.AMOUNT) {
    return (
      <ActionBar
        onClickBack={() => {
          setStep(STEPS.MESSAGE);
        }}
        button={{
          text: 'Confirm',
          onClick: send,
          disabled: !signerIsReady || !address || !(message || amount),
        }}
      >
        <InputNumber
          min={1}
          onChange={(value) => setAmount(+value)}
          value={amount}
          placeholder="Amount"
        />
        <span>🟢</span>
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarWrapper;
