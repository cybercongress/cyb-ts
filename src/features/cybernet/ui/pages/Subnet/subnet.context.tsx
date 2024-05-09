import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';

const SubnetContext = React.createContext<{
  subnetQuery: ReturnType<typeof useCybernetContract<SubnetInfo>>;
  neuronsQuery: ReturnType<typeof useCybernetContract<SubnetNeuron[]>>;
}>({
  subnetQuery: null,
  neuronsQuery: null,
});

export function useSubnet() {
  return React.useContext(SubnetContext);
}

function SubnetProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const netuid = Number(id!);

  const subnetQuery = useCybernetContract<SubnetInfo>({
    query: {
      get_subnet_info: {
        netuid,
      },
    },
  });

  const neuronsQuery = useCybernetContract<SubnetNeuron[]>({
    query: {
      get_neurons: {
        netuid,
      },
    },
  });

  const value = useMemo(() => {
    return { subnetQuery, neuronsQuery };
  }, [subnetQuery, neuronsQuery]);

  return (
    <SubnetContext.Provider value={value}>{children}</SubnetContext.Provider>
  );
}

export default SubnetProvider;
