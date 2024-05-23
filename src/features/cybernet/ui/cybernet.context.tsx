import React, { useMemo, useState } from 'react';
import { Networks } from 'src/types/networks';
import { CYBERNET_CONTRACT_ADDRESS } from '../constants';

type ContractType = 'graph' | 'ml';

type Contract = {
  name: string;
  address: string;
  apr: number;
};

const data = [
  {
    name: 'graph',
    type: 'graph',
    address: CYBERNET_CONTRACT_ADDRESS,
    //   apr: 35,
    //   docs: 'https://docs.spacepussy.ai',
    network: Networks.SPACE_PUSSY,
  },
  {
    name: 'ml',
    type: 'ml',
    address: '-',
    //   apr: 20,
    //   docs: 'https://docs.spacepussy.ai',
    network: Networks.SPACE_PUSSY,
  },
];

const CybernetContext = React.createContext<{
  contracts: Contract[];
  selectContract: (address: string) => void;
  selectedContract: string | null;
}>({
  contracts: {},
  selectContract: null,
  selectedContract: null,
});

export function useCybernet() {
  return React.useContext(CybernetContext);
}

function CybernetProvider({ children }: { children: React.ReactNode }) {
  const [selectedContractAddress, setSelectedContractAddress] = useState(
    CYBERNET_CONTRACT_ADDRESS
  );
  const [contracts] = useState<(typeof CybernetContext)['']>(data);

  const selectedContract = contracts.find(
    (contract) => contract.address === selectedContractAddress
  );

  console.debug('selectedContract', selectedContract);

  return (
    <CybernetContext.Provider
      value={useMemo(() => {
        return {
          contracts,
          selectContract: setSelectedContractAddress,
          selectedContract,
        };
      }, [contracts, selectedContract])}
    >
      {children}
    </CybernetContext.Provider>
  );
}

export default CybernetProvider;
