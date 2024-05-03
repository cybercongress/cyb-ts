import { useEffect, useState } from 'react';
import { Button, InputNumber, Tooltip } from 'src/components';
import styles from './WeightsSetter.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import useExecuteCybernetContract from '../../../../../useExecuteCybernetContract';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'src/routes';
import { usePreviousPage } from 'src/contexts/previousPage';
import QuestionBtn from 'src/components/Rank/QuestionBtn/QuestionBtn';

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
  metadata,
  neurons,
  maxWeightsLimit,
}: Props) {
  const w = sessionStorage.getItem('subnetWeights');
  const weights2 = w ? JSON.parse(w)[netuid] : new Array(length).fill(10);
  const [weights, setWeights] = useState(weights2);

  const history = useLocation();

  console.log(weights);

  useEffect(() => {
    return () => {
      sessionStorage.setItem(
        'subnetWeights',
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
    <div className={styles.wrapper}>
      {/* <p>Set weights for operators</p>
      <br /> */}

      <Tooltip tooltip="You can navigate to check metadata, weighs will be saved">
        <p>
          Weights <QuestionBtn />
        </p>
      </Tooltip>

      <div className={styles.group}>
        {new Array(length).fill(null).map((_, i) => {
          const { hotkey, uid } = neurons[i];
          return (
            <div key={i}>
              {/* <Link to={cybernetRoutes.delegator.getLink(hotkey)}>{uid}</Link> */}
              {/* <br /> */}
              {/* <Link
                to={
                  routes.oracle.ask.getLink(metadata) +
                  `?neuron=${hotkey}&subnet=${netuid}`
                }
              > */}
              {/* <Cid cid={metadata}> */}
              {/* metadata */}
              {/* {`${metadata.substr(0, 6)}...${metadata.substr(-6)}`} */}
              {/* </Cid> */}
              {/* </Link> */}
              <InputNumber
                autoFocus={neuron === hotkey}
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
