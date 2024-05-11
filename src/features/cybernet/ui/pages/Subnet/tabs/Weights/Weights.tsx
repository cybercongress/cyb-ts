import React from 'react';
import WeightsTable from './WeightsTable/WeightsTable';
import WeightsSetter from './WeightsSetter/WeightsSetter.1';
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
      <Display title={<DisplayTitle title="Grades" />}>
        <WeightsTable
          data={weightsQuery.data!}
          neurons={neurons}
          maxWeightsLimit={maxWeightsLimit}
        />
      </Display>

      <br />
    </div>
  );
}

export default Weights;
