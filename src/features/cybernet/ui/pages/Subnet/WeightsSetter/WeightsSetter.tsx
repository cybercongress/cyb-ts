import { useState } from 'react';
import { Button, InputNumber } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../useExecuteCybernetContract';

type Props = {
  length: number;
  netuid: number;
  max_weights_limit: number;
  callback: () => void;
};

function WeightsSetter({ length, netuid, max_weights_limit, callback }: Props) {
  const [weights, setWeights] = useState(new Array(length).fill(0));

  const { setAdviser } = useAdviser();

  const { mutate: submit } = useExecuteCybernetContract({
    query: {
      set_weights: {
        dests: new Array(length).fill(0).map((_, i) => i),
        netuid,
        weights: weights.map(
          (w) => +((max_weights_limit * w) / 100).toFixed(0)
        ),
        version_key: 0,
      },
      onSuccess: () => {
        setWeights(new Array(length).fill(0));
        setAdviser('Weights set', 'green');
        callback();
      },
    },
  });

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
