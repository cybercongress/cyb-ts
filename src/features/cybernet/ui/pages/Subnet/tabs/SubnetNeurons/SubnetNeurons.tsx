import SubnetNeuronsTable from './SubnetNeuronsTable/SubnetNeuronsTable';
import { useSubnet } from '../../subnet.context';
import styles from './SubnetNeurons.module.scss';
import WeightsSetter from '../Weights/WeightsSetter/WeightsSetter';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { MainContainer } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function SubnetNeurons({ addressRegisteredInSubnet }: Props) {
  const { subnetQuery, neuronsQuery } = useSubnet();

  const subnetNeurons = neuronsQuery.data;
  const { network_modality: subnetType, netuid } = subnetQuery.data || {};

  const address = useCurrentAddress();

  const weightsQuery = useQueryCybernetContract<any[]>({
    query: {
      get_weights_sparse: {
        netuid,
      },
    },
  });

  // useAdviserTexts({
  //   defaultText: 'Subnet neurons',
  //   isLoading: subnetQuery.loading || neuronsQuery.loading,

  useAdviserTexts({
    defaultText: 'Subnet neurons',
  });
  // });

  // fix

  if (!subnetNeurons || !subnetQuery.data) {
    return null;
  }

  const myId = subnetNeurons.find((n) => n.hotkey === address)?.uid;
  const myW = weightsQuery.data?.[myId];

  console.log(myW);

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
          weights={weightsQuery.data || []}
          addressRegisteredInSubnet={addressRegisteredInSubnet}
          metadata={subnetQuery.data?.metadata}
        />

        {addressRegisteredInSubnet && !!subnetNeurons?.length && (
          <WeightsSetter
            // netuid={netuid}
            // length={subnetQuery.data?.subnetwork_n}
            // metadata={subnetQuery.data?.metadata}
            weights={myW}
            // neurons={subnetNeurons}
            callback={() => {
              weightsQuery.refetch();
            }}
            // maxWeightsLimit={subnetQuery.data?.max_weights_limit}
          />
        )}
      </div>
    </Display>
    // </MainContainer>
  );
}

export default SubnetNeurons;
