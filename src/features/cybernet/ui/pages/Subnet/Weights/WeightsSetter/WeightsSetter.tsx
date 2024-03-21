import { useState } from 'react';
import { Button, InputNumber } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../../useExecuteCybernetContract';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import { Link } from 'react-router-dom';

type Props = {
  length: number;
  netuid: number;
  callback: () => void;
  neurons: SubnetNeuron[];

  max_weights_limit: number;
};

function WeightsSetter({
  length,
  netuid,
  callback,
  neurons,
  max_weights_limit,
}: Props) {
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
      {/* <p>Set weights for operators. Max weights limit: {max_weights_limit}</p> */}

      <p>Set weights for operators</p>
      <p>Sum: {sum}% (max 100%)</p>

      <br />

      <div className={styles.group}>
        {new Array(length).fill(null).map((_, i) => {
          const { hotkey, uid } = neurons[i];
          return (
            <div key={i}>
              <Link to={cybernetRoutes.delegator.getLink(hotkey)}>{uid}</Link>
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
