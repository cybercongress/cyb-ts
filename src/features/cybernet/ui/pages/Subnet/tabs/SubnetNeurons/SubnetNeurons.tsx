import SubnetNeuronsTable from './SubnetNeuronsTable/SubnetNeuronsTable';
import { useSubnet } from '../../subnet.context';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { ActionBar } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import useCybernetTexts from 'src/features/cybernet/ui/useCybernetTexts';
import { useCurrentContract } from 'src/features/cybernet/ui/cybernet.context';
import { checkIsMLVerse } from 'src/features/cybernet/ui/utils/verses';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function SubnetNeurons({ addressRegisteredInSubnet }: Props) {
  const { subnetQuery, neuronsQuery } = useSubnet();

  const subnetNeurons = neuronsQuery.data;
  const { network_modality: subnetType, netuid } = subnetQuery.data || {};

  const rootSubnet = netuid === 0;

  const { getText } = useCybernetTexts();

  // useAdviserTexts({
  //   defaultText: 'Subnet neurons',
  //   isLoading: subnetQuery.loading || neuronsQuery.loading,
  // });

  useAdviserTexts({
    defaultText: `${getText(rootSubnet ? 'root' : 'subnetwork')} ${getText(
      rootSubnet ? 'rootValidator' : 'delegate',
      true
    )}`,
  });

  const {
    grades: {
      newGrades: { save, data: newGrades, isGradesUpdated, isLoading },
    },
  } = useSubnet();
  const { type } = useCurrentContract();

  const isMLVerse = checkIsMLVerse(type);

  // fix
  if (!subnetNeurons || !subnetQuery.data) {
    return null;
  }

  return (
    <Display
      noPaddingX
      // title={
      //   <DisplayTitle title={<header>{getText('validator', true)}</header>} />
      // }
    >
      <SubnetNeuronsTable />

      {addressRegisteredInSubnet && !rootSubnet && !isMLVerse && (
        <ActionBar
          button={{
            text: 'update grades',
            onClick: save,
            disabled: !isGradesUpdated,
            pending: isLoading,
          }}
        />
      )}
    </Display>
  );
}

export default SubnetNeurons;
