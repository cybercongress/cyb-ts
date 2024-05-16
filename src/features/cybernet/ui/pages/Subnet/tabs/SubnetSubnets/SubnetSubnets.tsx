import React, { useState } from 'react';
import { Button, Input, InputNumber } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { useAdviser } from 'src/features/adviser/context';
import { SubnetInfo } from 'src/features/cybernet/types';
import useExecuteCybernetContract from 'src/features/cybernet/ui/useExecuteCybernetContract';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';

function SubnetSubnets() {
  const { data, loading, error } = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  const { setAdviser } = useAdviser();

  const [weights, setWeights] = useState({});

  const { mutate: submit, isLoading } = useExecuteCybernetContract({
    query: {
      set_weights: {
        dests: new Array(data?.length - 1).fill(0).map((_, i) => i + 1),
        netuid: 0,
        weights: data?.slice(1, data.length).map((subnet) => {
          const w = subnet.netuid;

          const v = +((65535 * weights[w]) / 10).toFixed(0);

          return v || 0;
        }),
        version_key: 0,
      },
    },
    onSuccess: () => {
      setAdviser('Weights set', 'green');
      //   callback();
    },
  });

  console.log(weights);

  return (
    <Display>
      <h1>subnets</h1>

      {data?.slice(1, data.length).map((subnet) => (
        <div key={subnet.netuid}>
          <h2>netuid: {subnet.netuid}</h2>

          <br />

          <InputNumber
            value={weights[subnet.netuid] || 0}
            onChange={(e) => {
              const newWeights = { ...weights };
              newWeights[subnet.netuid] = +e;
              setWeights(newWeights);
            }}
          />

          <br />
        </div>
      ))}

      <Button onClick={submit}>Submit</Button>
    </Display>
  );
}

export default SubnetSubnets;
