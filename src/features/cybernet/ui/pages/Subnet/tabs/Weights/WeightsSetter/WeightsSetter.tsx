import { useEffect, useRef, useState } from 'react';
import { ActionBar, InputNumber } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../../../useExecuteCybernetContract';
import { usePreviousPage } from 'src/contexts/previousPage';
import { sessionStorageKeys } from 'src/constants/sessionStorageKeys';
import { useSubnet } from '../../../subnet.context';

const DEFAULT_WEIGHT = 5;

const sessionStorageKey = sessionStorageKeys.subnetWeights;

type Props = {
  callback: () => void;
};

function getSSData() {
  const data = sessionStorage.getItem(sessionStorageKey);

  return data ? JSON.parse(data) : null;
}

function WeightsSetter({ callback, weights: w }: Props) {
  const { subnetQuery, neuronsQuery } = useSubnet();

  console.log(w);

  const w2 = w?.reduce((acc, [uid, value], i) => {
    acc[uid] = value;
    return acc;
  }, {});

  console.log(w2);

  const {
    max_weights_limit: maxWeightsLimit,
    subnetwork_n: length,
    netuid,
  } = subnetQuery.data!;

  const neurons = neuronsQuery.data || [];

  const ssData = getSSData()?.[netuid];
  console.log(ssData);

  const [weights, setWeights] = useState(
    // ssData ||
    new Array(length)
      .fill(DEFAULT_WEIGHT)
      .map((_, i) => (w2?.[i] ? (w2[i] / maxWeightsLimit) * 10 : 0).toFixed())
  );

  console.log(weights);

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

  const ref = useRef<HTMLDivElement>(null);

  // need this because autoFocus not updateable
  useEffect(() => {
    const search = new URLSearchParams(previousPathname?.split('?')[1]);

    const neuron = search.get('neuron');

    if (ref.current) {
      ref.current.querySelector(`[data-address="${neuron}"]`)?.focus();
    }
  }, [previousPathname]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.group} ref={ref}>
        <span>change grades</span>
        {new Array(length).fill(null).map((_, i) => {
          const { hotkey } = neurons[i];

          const value = weights[i];
          return (
            <div key={i}>
              <InputNumber
                data-address={hotkey}
                maxValue={10}
                value={value || (value === null ? 0 : value)}
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
          text: 'Submit grades',
          onClick: submit,
          disabled: isLoading,
        }}
      />
    </div>
  );
}

export default WeightsSetter;
