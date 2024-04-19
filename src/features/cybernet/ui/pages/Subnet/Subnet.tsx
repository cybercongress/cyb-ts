import { Route, Routes, useParams } from 'react-router-dom';
import { MainContainer, Tabs } from 'src/components';
import {
  SubnetInfo as SubnetInfoType,
  SubnetNeuron,
} from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import ActionBar from './SubnetActionBar/SubnetActionBar';
import Weights from './tabs/Weights/Weights';
import SubnetHyperParams from './tabs/SubnetHyperParams/SubnetHyperParams';
import SubnetInfo from './tabs/SubnetInfo/SubnetInfo';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

function Subnet() {
  const { id, ...rest } = useParams();
  const tab = rest['*'];

  const address = useCurrentAddress();

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

  const { data: addressSubnetRegistrationStatus, refetch } =
    useQueryCybernetContract<number | null>({
      query: {
        get_uid_for_hotkey_on_subnet: {
          netuid,
          hotkey: address,
        },
      },
    });

  useAdviserTexts({
    isLoading: subnetQuery.loading,
    error: subnetQuery.error || neuronsQuery.error,
    defaultText: 'subnet',
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
                addressRegisteredInSubnet={!!addressSubnetRegistrationStatus}
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

      <ActionBar
        netuid={netuid}
        burn={subnetQuery.data?.burn}
        addressSubnetRegistrationStatus={addressSubnetRegistrationStatus}
        refetch={refetch}
      />
    </MainContainer>
  );
}

export default Subnet;
