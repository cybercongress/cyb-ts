import SubnetNeuronsTable from './SubnetNeuronsTable/SubnetNeuronsTable';
import { useSubnet } from '../../subnet.context';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { ActionBar } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function SubnetNeurons({ addressRegisteredInSubnet }: Props) {
  const { subnetQuery, neuronsQuery } = useSubnet();

  console.log(addressRegisteredInSubnet, 'addressRegisteredInSubnet');

  const subnetNeurons = neuronsQuery.data;
  const { network_modality: subnetType, netuid } = subnetQuery.data || {};

  const rootSubnet = netuid === 0;

  // useAdviserTexts({
  //   defaultText: 'Subnet neurons',
  //   isLoading: subnetQuery.loading || neuronsQuery.loading,
  // });

  useAdviserTexts({
    defaultText: 'Subnet operators',
  });

  const {
    grades: {
      newGrades: { save, data: newGrades, isGradesUpdated },
    },
  } = useSubnet();

  // fix
  if (!subnetNeurons || !subnetQuery.data) {
    return null;
  }

  return (
    // <MainContainer width="100%">
    <Display
      noPaddingX
      title={<DisplayTitle title={<header>Operators</header>} />}
    >
      <SubnetNeuronsTable />

      {addressRegisteredInSubnet && !rootSubnet && (
        <ActionBar
          button={{
            text: 'update grades',
            onClick: save,
            disabled: !isGradesUpdated,
          }}
        />
      )}
    </Display>
    // </MainContainer>
  );
}

export default SubnetNeurons;
