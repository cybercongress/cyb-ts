import SubnetNeuronsTable from './SubnetNeuronsTable/SubnetNeuronsTable';
import { useSubnet } from '../../subnet.context';
import styles from './SubnetNeurons.module.scss';
import WeightsSetter from '../Weights/WeightsSetter/WeightsSetter';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { MainContainer } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function SubnetNeurons({ addressRegisteredInSubnet }: Props) {
  const { subnetQuery, neuronsQuery } = useSubnet();

  const subnetNeurons = neuronsQuery.data;
  const { network_modality: subnetType, netuid } = subnetQuery.data || {};

  useAdviserTexts({
    defaultText: 'Subnet neurons',
    isLoading: subnetQuery.loading || neuronsQuery.loading,
  });

  // fix
  if (!subnetNeurons) {
    return null;
  }

  return (
    // <MainContainer width="100%">
    <Display
      noPaddingX
      title={<DisplayTitle title={<header>Neurons</header>} />}
    >
      <div className={styles.wrapper}>
        <SubnetNeuronsTable
          neurons={subnetNeurons}
          subnetType={subnetType}
          netuid={netuid}
          addressRegisteredInSubnet={addressRegisteredInSubnet}
          metadata={subnetQuery.data?.metadata}
        />

        {addressRegisteredInSubnet && !!subnetNeurons?.length && (
          <WeightsSetter
            netuid={netuid}
            length={subnetQuery.data?.subnetwork_n}
            metadata={subnetQuery.data?.metadata}
            neurons={subnetNeurons}
            callback={() => {
              // weightsQuery.refetch();
            }}
            maxWeightsLimit={subnetQuery.data?.max_weights_limit}
          />
        )}
      </div>
    </Display>
    // </MainContainer>
  );
}

export default SubnetNeurons;
