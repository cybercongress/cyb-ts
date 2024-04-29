import React from 'react';
import WeightsTable from './WeightsTable/WeightsTable';
import WeightsSetter from './WeightsSetter/WeightsSetter';
import { SubnetNeuron } from 'src/features/cybernet/types';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import Display from 'src/components/containerGradient/Display/Display';
import useQueryCybernetContract from '../../../../useQueryCybernetContract.refactor';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {
  neurons: SubnetNeuron[];
  netuid: number;
  maxWeightsLimit: number;
  addressRegisteredInSubnet: boolean;
};

function Weights({
  neurons,
  netuid,
  maxWeightsLimit,
  addressRegisteredInSubnet,
  metadata,
}: Props) {
  const weightsQuery = useQueryCybernetContract<any[]>({
    query: {
      get_weights_sparse: {
        netuid,
      },
    },
  });

  useAdviserTexts({
    isLoading: weightsQuery.loading,
    error: weightsQuery.error,
    defaultText: 'Subnet weights',
  });

  const { length } = weightsQuery.data || [];

  if (!length) {
    return null;
  }

  // maybe remove
  if (!neurons.length) {
    return null;
  }

  return (
    <div>
      <Display title={<DisplayTitle title="Weights" />}>
        <WeightsTable
          data={weightsQuery.data!}
          neurons={neurons}
          maxWeightsLimit={maxWeightsLimit}
        />
      </Display>

      <br />

      {addressRegisteredInSubnet && (
        <Display title={<DisplayTitle title="Weights setting" />}>
          <WeightsSetter
            netuid={netuid}
            length={length}
            metadata={metadata}
            neurons={neurons}
            callback={() => {
              weightsQuery.refetch();
            }}
            maxWeightsLimit={maxWeightsLimit}
          />
        </Display>
      )}
    </div>
  );
}

export default Weights;
