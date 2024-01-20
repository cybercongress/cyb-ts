import { ActionBar, Input, InputNumber } from 'src/components';
import { routes } from 'src/routes';
import { isBostromAddress } from '../utils';
import { log } from 'tone/build/esm/core/util/Debug';
import { useEffect, useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { AdviserProps } from '../Sense';
import { CYBER } from 'src/utils/config';
import { coin } from '@cosmjs/launchpad';

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

  const [tx, setTx] = useState({
    hash: '',
    onSuccess: null,
  });

  const waitForTransaction = useWaitForTransaction(tx);

  // useEffect(() => {
  //   const {error, isLoading } = waitForTransaction;

  //   adviser.setLoading(isLoading);

  //   if (error) {
  //     adviser.setError(error);
  //   }

  // }, [waitForTransaction]);

  const { signingClient, signer } = useSigningClient();

  const signerIsReady = Boolean(signer && signingClient);

  async function send() {
    if (!signerIsReady || !address) {
      return;
    }

    try {
      adviser.setLoading(true);
      adviser.setAdviserText('Preparing transaction...');

      const response = await signingClient!.sendTokens(
        address,
        id,
        [coin(amount, CYBER.DENOM_CYBER)],
        'auto',
        message
      );

      if (response.code !== 0) {
        throw new Error(response.rawLog);
      }

      adviser.setAdviserText('Confirming transaction...');
      setTx({
        hash: response.transactionHash,
        onSuccess: () => {
          update();
          setStep(STEPS.INITIAL);

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
        button={{
          text: 'Next',
          onClick: () => {
            setStep(STEPS.AMOUNT);
          },
        }}
      >
        <Input
          isTextarea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Message"
        />
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
          disabled: !signerIsReady || !address,
        }}
      >
        <InputNumber
          min={1}
          onChange={(value) => setAmount(value || 1)}
          value={amount}
          placeholder="Amount"
        />
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarWrapper;
