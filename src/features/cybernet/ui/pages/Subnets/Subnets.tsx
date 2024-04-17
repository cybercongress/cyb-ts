import { MainContainer, DenomArr } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import SubnetsTable from './SubnetsTable/SubnetsTable';
import { SubnetInfo } from 'src/features/cybernet/types';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { BLOCK_REWARD } from 'src/features/cybernet/constants';

function Subnets() {
  const { data, loading, error } = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  console.log('Subnets', data, loading, error);

  // possible to refactor to 1 loop
  const rootSubnet = data?.find((subnet) => subnet.netuid === 0);
  const graphSubnets = data?.filter((subnet) => subnet.network_modality === 0);
  const p2pSubnets = data?.filter((subnet) => subnet.network_modality === 1);

  useAdviserTexts({
    isLoading: loading,
    error,
    // defaultText: (
    //   <>
    //     block reward is
    //     {BLOCK_REWARD} <DenomArr denomValue="pussy" />
    //   </>
    // ),
    defaultText: `block reward is ${BLOCK_REWARD.toLocaleString()} pussy 🟣`,
  });
  return (
    <MainContainer resetMaxWidth>
      {rootSubnet && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={<header style={{ marginLeft: 15 }}>Root subnet</header>}
            />
          }
        >
          <SubnetsTable data={[rootSubnet] || []} />
        </Display>
      )}

      {!!graphSubnets?.length && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={<header style={{ marginLeft: 15 }}>Graph subnets</header>}
            />
          }
        >
          <SubnetsTable data={graphSubnets} />
        </Display>
      )}

      {!!p2pSubnets?.length && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={<header style={{ marginLeft: 15 }}>p2p subnets</header>}
            />
          }
        >
          <SubnetsTable data={p2pSubnets} />
        </Display>
      )}
    </MainContainer>
  );
}

export default Subnets;
