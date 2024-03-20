import React from 'react';
import WeightsTable from './WeightsTable/WeightsTable';
import WeightsSetter from './WeightsSetter/WeightsSetter';
import { SubnetNeuron } from 'src/features/cybernet/types';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import Display from 'src/components/containerGradient/Display/Display';
import useQueryCybernetContract from '../../../useQueryCybernetContract.refactor';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {
  neurons: SubnetNeuron[];
  netuid: number;
  max_weights_limit: number;
};

function Weights({ neurons, netuid, max_weights_limit }: Props) {
  const weightsQuery = useQueryCybernetContract<any[]>({
    query: {
      get_weights: {
        netuid,
      },
    },
  });

  useAdviserTexts({
    isLoading: weightsQuery.loading,
    error: weightsQuery.error,
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
        <WeightsTable data={weightsQuery.data!} neurons={neurons} />
      </Display>

      <Display title={<DisplayTitle title="Weights" />}>
        <WeightsSetter
          netuid={netuid}
          length={length}
          neurons={neurons}
          callback={() => {
            weightsQuery.refetch();
          }}
          max_weights_limit={max_weights_limit}
        />
      </Display>
    </div>
  );
}

export default Weights;
