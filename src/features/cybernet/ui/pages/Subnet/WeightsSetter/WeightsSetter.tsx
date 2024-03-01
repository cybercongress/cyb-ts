import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber } from 'src/components';
import { useSigningClient } from 'src/contexts/signerClient';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/api';
import useCybernetContract from 'src/features/cybernet/useContract';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import Soft3MessageFactory from 'src/soft.js/api/msgs';
import { transactionHash } from '../../../../../../../.storybook/stubs';
import Display from 'src/components/containerGradient/Display/Display';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';

function WeightsSetter({ length, netuid, max_weights_limit, callback }) {
  const [weights, setWeights] = useState(new Array(length).fill(0));

  const { signer, signingClient } = useSigningClient();

  const [tx, setTx] = useState({
    hash: '',
  });

  const query = useWaitForTransaction(tx);

  console.log(weights);

  console.log('query', query);

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

      setAdviser('Setting weights...', 'yellow');

      const executeResponseResult = await signingClient.execute(
        address,
        CYBERNET_CONTRACT_ADDRESS,
        {
          set_weights: {
            dests: new Array(length).fill(0).map((_, i) => i),
            netuid: netuid,
            weights: weights.map(
              (w) => +((max_weights_limit * w) / 100).toFixed(0)
            ),
            version_key: 0,
          },
        },
        Soft3MessageFactory.fee(2)
      );

      console.log(`executeResponseResult`, executeResponseResult);

      setTx({
        hash: executeResponseResult.transactionHash,
        onSuccess: () => {
          console.log('success');

          setWeights(new Array(length).fill(0));
          setAdviser('Weights set', 'green');
          callback();
        },
      });
    } catch (error) {
      console.error(error);

      setAdviser(error.message, 'red');
    }
  }

  const sum = weights.reduce((acc, w) => acc + w, 0);

  return (
    <div>
      <br />
      <p>Set weights for operators. Max weights limit: {max_weights_limit}</p>
      <p>Sum: {sum}</p>

      <br />

      <div className={styles.group}>
        {new Array(length).fill(null).map((_, i) => {
          return (
            // <Display isVertical key={i}>
            <div>
              <span>Operator: {i}</span>
              <InputNumber
                value={weights[i]}
                onChange={(e) => {
                  const newWeights = [...weights];
                  newWeights[i] = +e;
                  setWeights(newWeights);
                }}
              />
            </div>
            // </Display>
          );
        })}
      </div>

      <br />
      <Button onClick={submit} disabled={sum > 100 || sum === 0}>
        Submit
      </Button>
    </div>
  );
}

export default WeightsSetter;
