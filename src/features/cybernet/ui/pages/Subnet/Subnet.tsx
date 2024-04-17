import { Link, Route, Routes, useParams } from 'react-router-dom';
import { MainContainer, Tabs } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import {
  SubnetHyperParameters,
  SubnetInfo as SubnetInfoType,
  SubnetNeuron,
} from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { routes } from 'src/routes';
import ActionBar from './SubnetActionBar/SubnetActionBar';
import Weights from './tabs/Weights/Weights';
import { cybernetRoutes } from '../../routes';
import SubnetNeurons from './SubnetNeurons/SubnetNeurons';
import styles from './Subnet.module.scss';
import SubnetHyperParams from './tabs/SubnetHyperParams/SubnetHyperParams';
import SubnetInfo from './tabs/SubnetInfo/SubnetInfo';

function Subnet() {
  const { id, ...rest } = useParams();
  const tab = rest['*'];

  const netuid = Number(id!);

  const subnetQuery = useCybernetContract<SubnetInfoType>({
    query: {
      get_subnet_info: {
        netuid,
      },
    },
  });

  const neuronsQuery = useCybernetContract<SubnetNeuron[]>({
    query: {
      get_neurons: {
        netuid,
      },
    },
  });

  console.info('subnet info', subnetQuery.data);

  return (
    <MainContainer resetMaxWidth>
      <Tabs
        options={[
          {
            to: './',
            key: 'info',
            text: 'info',
          },
          {
            to: './hyperparams',
            key: 'hyperparams',
            text: 'hyperparams',
          },
          {
            to: './weights',
            key: 'weights',
            text: 'weights',
          },
        ]}
        selected={tab || 'info'}
      />

      <Routes>
        <Route path="/hyperparams" element={<SubnetHyperParams />} />

        {subnetQuery.data?.subnetwork_n > 0 && (
          <Route
            path="/weights"
            element={
              <Weights
                neurons={neuronsQuery.data || []}
                netuid={netuid}
                maxWeightsLimit={subnetQuery.data.max_weights_limit}
              />
            }
          />
        )}

        <Route
          path="/"
          element={
            <SubnetInfo data={subnetQuery.data} neurons={neuronsQuery.data} />
          }
        />
      </Routes>

      <ActionBar netuid={netuid} burn={subnetQuery.data?.burn} />
    </MainContainer>
  );
}

export default Subnet;
