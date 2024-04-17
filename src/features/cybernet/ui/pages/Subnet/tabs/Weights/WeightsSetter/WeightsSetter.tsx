import { useState } from 'react';
import { Button, InputNumber } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../../../useExecuteCybernetContract';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import { Link } from 'react-router-dom';

type Props = {
  length: number;
  netuid: number;
  callback: () => void;
  neurons: SubnetNeuron[];
  maxWeightsLimit: number;
};

function WeightsSetter({
  length,
  netuid,
  callback,
  neurons,
  maxWeightsLimit,
}: Props) {
  const [weights, setWeights] = useState(new Array(length).fill(10));

  const { setAdviser } = useAdviser();

  const { mutate: submit } = useExecuteCybernetContract({
    query: {
      set_weights: {
        dests: new Array(length).fill(0).map((_, i) => i),
        netuid,
        weights: weights.map((w) => +((maxWeightsLimit * w) / 100).toFixed(0)),
        version_key: 0,
      },
    },
    onSuccess: () => {
      setWeights(new Array(length).fill(0));
      setAdviser('Weights set', 'green');
      callback();
    },
  });

  return (
    <div>
      {/* <p>Set weights for operators</p>
      <br /> */}

      <div className={styles.group}>
        {new Array(length).fill(null).map((_, i) => {
          const { hotkey, uid } = neurons[i];
          return (
            <div key={i}>
              <Link to={cybernetRoutes.delegator.getLink(hotkey)}>{uid}</Link>
              <InputNumber
                maxValue={100}
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
      <Button onClick={submit} disabled={false}>
        Submit
      </Button>
    </div>
  );
}

export default WeightsSetter;
