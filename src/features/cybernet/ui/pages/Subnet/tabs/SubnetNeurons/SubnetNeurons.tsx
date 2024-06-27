import SubnetNeuronsTable from './SubnetNeuronsTable/SubnetNeuronsTable';
import { useCurrentSubnet, useSubnet } from '../../subnet.context';
import Display from 'src/components/containerGradient/Display/Display';
import useCybernetTexts from 'src/features/cybernet/ui/useCybernetTexts';
import { useCurrentContract } from 'src/features/cybernet/ui/cybernet.context';
import { checkIsMLVerse } from 'src/features/cybernet/ui/utils/verses';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import SubnetMentorsActionBar from './SubnetMentorsActionBar/SubnetMentorsActionBar';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function SubnetNeurons({ addressRegisteredInSubnet }: Props) {
  const { isRootSubnet } = useCurrentSubnet();

  const { getText } = useCybernetTexts();
  const { type } = useCurrentContract();

  const isMLVerse = checkIsMLVerse(type);

  useAdviserTexts({
    defaultText: `${getText(isRootSubnet ? 'root' : 'subnetwork')} ${getText(
      isRootSubnet ? 'rootValidator' : 'delegate',
      true
    )}`,
  });

  return (
    <Display noPaddingX noPaddingY>
      <SubnetNeuronsTable />

      {addressRegisteredInSubnet && !isRootSubnet && !isMLVerse && (
        <SubnetMentorsActionBar />
      )}
    </Display>
  );
}

export default SubnetNeurons;
