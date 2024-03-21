import { Link, useParams } from 'react-router-dom';
import { MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import {
  SubnetHyperParameters,
  SubnetInfo,
  SubnetNeuron,
} from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { routes } from 'src/routes';
import ActionBar from './SubnetActionBar/SubnetActionBar';
import Weights from './Weights/Weights';
import { cybernetRoutes } from '../../routes';
import SubnetNeurons from './SubnetNeurons/SubnetNeurons';
import styles from './Subnet.module.scss';

function Subnet() {
  const { id } = useParams();
  const netuid = Number(id!);

  const neuronsQuery = useCybernetContract<SubnetNeuron[]>({
    query: {
      get_neurons: {
        netuid,
      },
    },
  });

  const subnetQuery = useCybernetContract<SubnetInfo>({
    query: {
      get_subnet_info: {
        netuid,
      },
    },
  });

  const hyperparamsQuery = useCybernetContract<SubnetHyperParameters>({
    query: {
      get_subnet_hyperparams: {
        netuid,
      },
    },
  });

  console.info('info', subnetQuery.data);
  console.info('hyperparams', hyperparamsQuery);

  const subnetNeurons = neuronsQuery.data;

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title={'Subnet: ' + id} />}>
        <ul className={styles.list}>
          {subnetQuery.data &&
            Object.keys(subnetQuery.data).map((item) => {
              const value = subnetQuery.data[item];
              let content = value;

              if (item === 'owner') {
                content = (
                  <Link to={routes.neuron.getLink(value)}>{value}</Link>
                );
              }

              if (item === 'metadata') {
                content = (
                  <Link to={routes.oracle.ask.getLink(value)}>{value}</Link>
                );
              }

              return (
                <li key={item}>
                  {item}: <div>{content}</div>
                </li>
              );
            })}
        </ul>
      </Display>

      <Display title={<DisplayTitle title="Hyperparams" />}>
        <ul className={styles.list}>
          {hyperparamsQuery.data &&
            Object.keys(hyperparamsQuery.data).map((item) => {
              const value = hyperparamsQuery.data[item];
              let content = value;

              return (
                <li key={item}>
                  {item}: <div>{content}</div>
                </li>
              );
            })}
        </ul>
      </Display>

      {subnetNeurons && <SubnetNeurons neurons={subnetNeurons} />}

      {subnetQuery.data?.subnetwork_n > 0 && (
        <Weights
          neurons={neuronsQuery.data || []}
          netuid={netuid}
          max_weights_limit={subnetQuery.data.max_weights_limit}
        />
      )}
      <ActionBar netuid={netuid} burn={subnetQuery.data?.burn} />
    </MainContainer>
  );
}

export default Subnet;
