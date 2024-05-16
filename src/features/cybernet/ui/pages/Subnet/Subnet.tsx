import { Route, Routes, useParams } from 'react-router-dom';
import { MainContainer, Tabs } from 'src/components';
import ActionBar from './SubnetActionBar/SubnetActionBar';
import Weights from './tabs/Weights/Weights';
import SubnetInfo from './tabs/SubnetInfo/SubnetInfo';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import SubnetProvider, { useSubnet } from './subnet.context';
import SubnetNeurons from './tabs/SubnetNeurons/SubnetNeurons';
import useDelegate from '../../hooks/useDelegate';
import SubnetSubnets from './tabs/SubnetSubnets/SubnetSubnets';

function Subnet() {
  const { id, ...rest } = useParams();
  const tab = rest['*'];

  const address = useCurrentAddress();

  const netuid = Number(id!);

  const { subnetQuery, neuronsQuery } = useSubnet();

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

  console.log(subnetQuery);

  const addressRegisteredInSubnet = !!addressSubnetRegistrationStatus;

  const rootSubnet = subnetQuery.data?.netuid === 0;

  return (
    <MainContainer resetMaxWidth>
      <Tabs
        options={[
          {
            to: './info',
            key: 'info',
            text: 'info',
          },
          {
            to: './',
            key: 'neurons',
            text: 'neurons',
          },
          {
            to: './weights',
            key: 'weights',
            text: 'grades',
          },
          rootSubnet && {
            to: './subnets',
            key: 'subnets',
            text: 'subnets',
          },
        ]}
        selected={tab || 'neurons'}
      />

      <Routes>
        <Route
          path="/"
          element={
            <SubnetNeurons
              addressRegisteredInSubnet={addressRegisteredInSubnet}
            />
          }
        />

        {subnetQuery.data?.subnetwork_n > 0 && (
          <Route
            path="/weights"
            element={
              <Weights
                neurons={neuronsQuery.data || []}
                netuid={netuid}
                maxWeightsLimit={subnetQuery.data.max_weights_limit}
                addressRegisteredInSubnet={!!addressSubnetRegistrationStatus}
                metadata={subnetQuery.data.metadata}
              />
            }
          />
        )}

        <Route
          path="/info"
          element={
            <SubnetInfo data={subnetQuery.data} neurons={neuronsQuery.data} />
          }
        />

        <Route path="/subnets" element={<SubnetSubnets />} />
      </Routes>

      <ActionBar
        netuid={netuid}
        burn={subnetQuery.data?.burn}
        addressSubnetRegistrationStatus={addressSubnetRegistrationStatus}
        // refetch={refetch}
      />
    </MainContainer>
  );
}

export default function SubnetWithProvider() {
  return (
    <SubnetProvider>
      <Subnet />
    </SubnetProvider>
  );
}
