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

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'subnets',
  });
  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Subnets" />}>
        <RootSubnetsTable data={data || []} />
      </Display>
    </MainContainer>
  );
}

export default Subnets;
