import React, { useMemo, useState } from 'react';
import { Networks } from 'src/types/networks';
import useQueryCybernetContract from './useQueryCybernetContract.refactor';
import { ContractWithData, Economy, SubnetInfo } from '../types';
import { Metadata } from 'cosmjs-types/cosmos/bank/v1beta1/bank';

type ContractType = 'graph' | 'ml';

export enum ContractTypes {
  Graph = 'graph',
  ML = 'ml',
}

const CONTRACT_NEW2 =
  'pussy1xemzpkq2qd6a5e08xxy5ffcwx9r4xn5fqe6v02rkte883f9xhg5q29ye9y';
const CONTRACT_NEW =
  'pussy155k695hqnzl05lx79kg9754k8cguw7wled38u2qacpxl62mrkfasy3k6x5';

const CybernetContext = React.createContext<{
  contracts: ContractWithData[];
  selectContract: (address: string) => void;
  selectedContract: ContractWithData;
  // subnetsQuery: ReturnType<typeof useQueryCybernetContract<SubnetInfo[]>;
  // fix
  subnetsQuery: {
    data: SubnetInfo[];
  };
  subnetsQuery: any;
}>({
  contracts: {},
  selectContract: null,
  subnetsQuery: null,
  selectedContract: null,
});

export function useCybernet() {
  return React.useContext(CybernetContext);
}

function useCybernetContractWithData(address: string) {
  const metadataQuery = useQueryCybernetContract<Metadata>({
    contractAddress: address,
    query: {
      get_verse_metadata: {},
    },
  });

  const economyQuery = useQueryCybernetContract<Economy>({
    contractAddress: address,
    query: {
      get_economy: {},
    },
  });

  return {
    address: address,
    metadata: metadataQuery.data,
    economy: economyQuery.data,
    isLoading: metadataQuery.loading || economyQuery.loading,
  };
}

function CybernetProvider({ children }: { children: React.ReactNode }) {
  const [selectedContractAddress, setSelectedContractAddress] =
    useState(CONTRACT_NEW);

  const c1 = useCybernetContractWithData(CONTRACT_NEW);
  const c2 = useCybernetContractWithData(CONTRACT_NEW2);

  const subnetsQuery = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
    contractAddress: selectedContractAddress,
  });

  return (
    <CybernetContext.Provider
      value={useMemo(() => {
        const contracts = [
          {
            ...c1,
            type: c1.metadata?.types,
          },
          {
            ...c2,
            type: c2.metadata?.types,
          },
        ];

        return {
          contracts,
          subnetsQuery,
          selectContract: (value) => {
            setSelectedContractAddress(value || CONTRACT_NEW);
          },
          selectedContract: contracts.find(
            (contract) => contract.address === selectedContractAddress
          ),
        };
      }, [c1, selectedContractAddress, c2, subnetsQuery])}
    >
      {children}
    </CybernetContext.Provider>
  );
}

export function useCurrentContract() {
  const { selectedContract } = useCybernet();

  const { metadata } = selectedContract;
  const contractName = metadata?.name;

  return {
    contractName,
    network: 'pussy',
  };
}

export default CybernetProvider;
