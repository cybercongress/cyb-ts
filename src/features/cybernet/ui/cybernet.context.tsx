import React, { useMemo, useState } from 'react';
import { Networks } from 'src/types/networks';
import useQueryCybernetContract from './useQueryCybernetContract.refactor';
import { ContractWithData, Economy } from '../types';
import { Metadata } from 'cosmjs-types/cosmos/bank/v1beta1/bank';
import meta from 'src/components/AvailableAmount/AvailableAmount.stories';

type ContractType = 'graph' | 'ml';

const CONTRACT_OLD =
  'pussy1ddwq8rxgdsm27pvpxqdy2ep9enuen6t2yhrqujvj9qwl4dtukx0s8hpka9';
const CONTRACT_NEW =
  'pussy155k695hqnzl05lx79kg9754k8cguw7wled38u2qacpxl62mrkfasy3k6x5';

const CybernetContext = React.createContext<{
  contracts: ContractWithData[];
  selectContract: (address: string) => void;
  selectedContract: ContractWithData;
}>({
  contracts: {},
  selectContract: null,
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
  const c2 = useCybernetContractWithData(CONTRACT_OLD);

  return (
    <CybernetContext.Provider
      value={useMemo(() => {
        const contracts = [
          {
            ...c1,
            type: 'graph',
          },
          // {
          //   ...c1,
          //   metadata: {
          //     ...c1.metadata,
          //     name: 'same but ML type',
          //   },
          //   type: 'ml',
          // },
        ];

        console.log(contracts);

        return {
          contracts,
          selectContract: setSelectedContractAddress,
          selectedContract: contracts.find(
            (contract) => contract.address === selectedContractAddress
          ),
        };
      }, [c1, selectedContractAddress])}
    >
      {children}
    </CybernetContext.Provider>
  );
}

export default CybernetProvider;
