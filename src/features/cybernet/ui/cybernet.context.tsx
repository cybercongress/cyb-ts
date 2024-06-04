import React, { useMemo, useState } from 'react';

import useQueryCybernetContract from './useQueryCybernetContract.refactor';
import {
  ContractTypes,
  ContractWithData,
  Economy,
  Metadata,
  SubnetInfo,
} from '../types';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { isPussyAddress } from 'src/utils/address';
import { cybernetRoutes } from './routes';

const contractsConfig = [
  'pussy1j9qku20ssfjdzgl3y5hl0vfxzsjwzwn7d7us2t2n4ejgc6pesqcqhnxsz0',
  'pussy1guj27rm0uj2mhwnnsr8j7cz6uvsz2d759kpalgqs60jahfzwgjcs4l28cw',
];

// const legacy = [
//   'pussy155k695hqnzl05lx79kg9754k8cguw7wled38u2qacpxl62mrkfasy3k6x5',
//   'pussy1xemzpkq2qd6a5e08xxy5ffcwx9r4xn5fqe6v02rkte883f9xhg5q29ye9y',
// ];

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
  const location = useLocation();

  const isMainPage = !!matchPath(cybernetRoutes.verse.path, location.pathname);

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

    refetchInterval: isMainPage ? 20 * 1000 : undefined,
  });

  const { name, types } = metadataQuery.data || {};
  const type =
    name?.includes(ContractTypes.Graph) || types?.includes(ContractTypes.Graph)
      ? ContractTypes.Graph
      : ContractTypes.ML;

  return {
    address,
    type,
    metadata: metadataQuery.data,
    economy: economyQuery.data,
    isLoading: metadataQuery.loading || economyQuery.loading,
  };
}

function CybernetProvider({ children }: { children: React.ReactNode }) {
  const [selectedContractAddress, setSelectedContractAddress] = useState(
    contractsConfig[0]
  );

  const { nameOrAddress } = useParams();

  const c1 = useCybernetContractWithData(contractsConfig[0]);
  const c2 = useCybernetContractWithData(contractsConfig[1]);

  const contracts = useMemo(() => [c1, c2], [c1, c2]);

  const currentContract =
    nameOrAddress &&
    contracts.find(
      (contract) =>
        contract.address === nameOrAddress ||
        contract.metadata?.name === nameOrAddress
    );

  let address;

  if (nameOrAddress && isPussyAddress(nameOrAddress)) {
    address = nameOrAddress;
  } else if (
    nameOrAddress &&
    currentContract &&
    currentContract.metadata?.name === nameOrAddress
  ) {
    address = currentContract.address;
  }

  if (address && selectedContractAddress !== address) {
    setSelectedContractAddress(address);
  }

  const currentContract2 = contracts.find(
    (contract) => contract.address === selectedContractAddress
  );

  const subnetsQuery = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
    contractAddress: address,
  });

  return (
    <CybernetContext.Provider
      value={useMemo(() => {
        console.log('verses', contracts);

        return {
          contracts,
          subnetsQuery,
          selectedContract: currentContract2,
        };
      }, [contracts, subnetsQuery, currentContract2])}
    >
      {children}
    </CybernetContext.Provider>
  );
}

export function useCurrentContract() {
  const { selectedContract } = useCybernet();

  const { metadata } = selectedContract;
  const contractName = metadata?.name;
  const type = selectedContract?.type;

  return {
    contractName: contractName || selectedContract.address,
    network: 'pussy',
    type,
  };
}

export default CybernetProvider;
