import { ActionBar } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { SubnetInfo } from 'src/features/cybernet/types';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import SubnetsTable from '../../../Subnets/SubnetsTable/SubnetsTable';
import { useSubnet } from '../../subnet.context';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { isEqual } from 'lodash';

function SubnetSubnets({ addressRegisteredInSubnet }) {
  const { data, loading, error } = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  const subnetsWithoutRoot = data?.filter((subnet) => subnet.netuid !== 0);

  const {
    grades: {
      newGrades: { save, data: newGrades, isGradesUpdated },
    },
  } = useSubnet();

  return (
    <Display noPaddingX>
      <SubnetsTable
        data={subnetsWithoutRoot || []}
        addressRegisteredInSubnet={addressRegisteredInSubnet}
      />

      <ActionBar
        button={{
          text: 'update grades',
          onClick: save,
          disabled: !isGradesUpdated,
        }}
      />
    </Display>
  );
}

export default SubnetSubnets;
