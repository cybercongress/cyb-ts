import { Route, Routes, useParams } from 'react-router-dom';
import { Cid, MainContainer, Tabs } from 'src/components';
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
import { useCybernet } from '../../cybernet.context';
import useCybernetTexts from '../../useCybernetTexts';
import Display from 'src/components/containerGradient/Display/Display';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { trimString } from 'src/utils/utils';
import SubnetHeader from './SubnetHeader/SubnetHeader';
import Loader2 from 'src/components/ui/Loader2';

function Subnet() {
  const { id, ...rest } = useParams();
  const tab = rest['*'];

  const address = useCurrentAddress();

  const f = id === 'board' ? 0 : +id;
  const netuid = Number(f);

  // const {selectedContract} = useCybernet();

  const { subnetQuery, neuronsQuery, refetch: refetchSubnet } = useSubnet();

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
    // defaultText: 'subnet',
  });

  const addressRegisteredInSubnet = addressSubnetRegistrationStatus !== null;

  const rootSubnet = subnetQuery.data?.netuid === 0;

  const { getText } = useCybernetTexts();

  const tabs = [
    {
      to: './info',
      key: 'info',
      text: 'info',
    },
    {
      to: './',
      key: 'delegates',
      text: getText(rootSubnet ? 'rootValidator' : 'delegate', true),
    },

    {
      to: './grades',
      key: 'grades',
      text: 'grades',
      disabled: rootSubnet,
    },
  ];

  if (rootSubnet) {
    tabs.push({
      to: './faculties',
      key: 'faculties',
      text: getText('subnetwork', true),
    });
  }

  return (
    <>
      <SubnetHeader />

      <Tabs options={tabs} selected={tab || 'delegates'} />

      <Routes>
        <Route
          path="/"
          element={
            <SubnetNeurons
              addressRegisteredInSubnet={addressRegisteredInSubnet}
            />
          }
        />

        <Route
          path="/info"
          element={
            <SubnetInfo data={subnetQuery.data} neurons={neuronsQuery.data} />
          }
        />

        {subnetQuery.data?.subnetwork_n > 0 && (
          <Route
            path="/grades"
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
          path="/faculties"
          element={
            <SubnetSubnets
              addressRegisteredInSubnet={addressRegisteredInSubnet}
            />
          }
        />
      </Routes>

      {subnetQuery.loading && <Loader2 />}

      <ActionBar
        netuid={netuid}
        burn={subnetQuery.data?.burn}
        addressSubnetRegistrationStatus={addressSubnetRegistrationStatus}
        refetch={() => {
          refetchSubnet();
          refetch();
        }}
      />
    </>
  );
}

export default function SubnetWithProvider() {
  return (
    <SubnetProvider>
      <Subnet />
    </SubnetProvider>
  );
}
