import { useEffect, useState } from 'react';
import { ActionBar, Button, InputNumber, Tooltip } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../../../useExecuteCybernetContract';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'src/routes';
import { usePreviousPage } from 'src/contexts/previousPage';
import QuestionBtn from 'src/components/Rank/QuestionBtn/QuestionBtn';
import { sessionStorageKeys } from 'src/constants/sessionStorageKeys';

const DEFAULT_WEIGHT = 10;

const sessionStorageKey = sessionStorageKeys.subnetWeights;

type Props = {
  length: number;
  netuid: number;
  callback: () => void;
  neurons: SubnetNeuron[];
  maxWeightsLimit: number;
};

function getSSData() {
  const data = sessionStorage.getItem(sessionStorageKey);

  return data ? JSON.parse(data) : null;
}

function WeightsSetter({
  length,
  netuid,
  callback,
  neurons,
  maxWeightsLimit,
}: Props) {
  const ssData = getSSData()?.[netuid];
  const [weights, setWeights] = useState(
    ssData || new Array(length).fill(DEFAULT_WEIGHT)
  );

  useEffect(() => {
    return () => {
      sessionStorage.setItem(
        sessionStorageKey,
        JSON.stringify({
          [netuid]: weights,
        })
      );
    };
  }, [netuid, weights]);

  const { previousPathname } = usePreviousPage();

  const search = new URLSearchParams(previousPathname?.split('?')[1]);

  const neuron = search.get('neuron');

  const { setAdviser } = useAdviser();

  const { mutate: submit, isLoading } = useExecuteCybernetContract({
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
    <div className={styles.wrapper}>
      <div className={styles.group}>
        {new Array(length).fill(null).map((_, i) => {
          const { hotkey } = neurons[i];
          return (
            <div key={i}>
              <InputNumber
                autoFocus={neuron === hotkey}
                maxValue={100}
                value={weights[i] || DEFAULT_WEIGHT}
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

      <ActionBar
        button={{
          text: 'Submit weights',
          onClick: submit,
          disabled: isLoading,
        }}
      />
    </div>
  );
}

export default WeightsSetter;
