import { MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import RootSubnetsTable from './RootSubnetsTable/RootSubnetsTable';
import { SubnetInfo } from 'src/features/cybernet/types';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

function Subnets() {
  const { data, loading, error } = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  console.log('Subnets', data, loading, error);

  const subnetsWithoutRoot = data?.filter((subnet) => subnet.netuid !== 0);

  const rootSubnet = data?.find((subnet) => subnet.netuid === 0);

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'subnets',
  });
  return (
    <MainContainer resetMaxWidth>
      <Display
        noPaddingX
        title={
          <DisplayTitle
            title={<header style={{ marginLeft: 15 }}>Subnets</header>}
          />
        }
      >
        <RootSubnetsTable data={subnetsWithoutRoot || []} />
      </Display>

      {rootSubnet && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={<header style={{ marginLeft: 15 }}>Root subnet</header>}
            />
          }
        >
          <RootSubnetsTable data={[rootSubnet] || []} />
        </Display>
      )}
    </MainContainer>
  );
}

export default Subnets;
