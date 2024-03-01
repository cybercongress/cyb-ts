import React, { useEffect, useState } from 'react';
import { Input } from 'src/components';

import ActionBarCenter from 'src/components/actionBar';
import { useSigningClient } from 'src/contexts/signerClient';
import { useAdviser } from 'src/features/adviser/context';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/api';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import Soft3MessageFactory from 'src/soft.js/api/msgs';

enum Steps {
  INITITAL,
  REGISTED,
  ENTER_HOTKEY,
}

function ActionBar({ netuid, burn }) {
  const { signer, signingClient } = useSigningClient();

  const [step, setStep] = useState(Steps.INITITAL);

  // console.log(burn);

  // const address = useAppSelector(selectCurrentAddress);

  const [tx, setTx] = useState({
    hash: '',
  });

  const query = useWaitForTransaction(tx);

  console.log(query);

  const [hotkey, setHotkey] = useState('');

  const { setAdviser } = useAdviser();

  useEffect(() => {
    const { isLoading, error } = query;

    if (error) {
      setAdviser(error, 'red');
    } else if (isLoading) {
      setAdviser('Confirming  tx...', 'yellow');
    }

    return () => {
      //   setAdviser('');
    };
  }, [setAdviser, query]);

  async function submit() {
    if (!signer || !signingClient) {
      return;
    }

    try {
      const [{ address }] = await signer.getAccounts();

      console.log(address);

      setAdviser('Preparing tx...', 'yellow');

      const executeResponseResult = await signingClient.execute(
        address,
        CYBERNET_CONTRACT_ADDRESS,
        {
          burned_register: {
            netuid: netuid,
            hotkey: address,
          },
        },
        Soft3MessageFactory.fee(2),
        '',
        [
          {
            denom: 'pussy',
            amount: String(burn),
          },
        ]
      );

      console.log(`executeResponseResult`, executeResponseResult);

      setTx({
        hash: executeResponseResult.transactionHash,
        onSuccess: () => {
          console.log('success');

          // setWeights(new Array(length).fill(0));
          setAdviser('Registered', 'green');

          setHotkey('');
          setStep(Steps.INITITAL);
          //   callback();
        },
      });
    } catch (error) {
      console.error(error);

      setAdviser(error.message, 'red');
    }
  }

  let button;
  let content;

  switch (step) {
    case Steps.INITITAL:
      button = {
        text: 'Register to subnet',
        onClick: () => {
          submit();
          // setStep(Steps.ENTER_HOTKEY);
        },
      };

      content = <>price is {burn}</>;

      break;

    case Steps.ENTER_HOTKEY:
      button = {
        text: 'Submit',
        onClick: submit,
        disabled: !hotkey,
      };

      content = (
        <>
          Price is {burn}
          <Input
            value={hotkey}
            placeholder="address"
            onChange={(e) => setHotkey(e.target.value)}
          />
        </>
      );

      break;

    default:
      break;
  }

  return <ActionBarCenter button={button}>{content}</ActionBarCenter>;
}

export default ActionBar;
