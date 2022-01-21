import React, { useEffect, useCallback, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import { makeTags, trimString, formatNumber } from '../../../utils/utils';
import { CardStatisics } from '../../../components';
import { ContainerCardStatisics, ContainerCol } from '../ui/ui';
import ContractTable from './ContractTable';

const PAGE_SIZE = 15;

const getContracts = async (pageSize = 10, offset = 0) => {
  const response = await fetch(
    `https://graph.juno.giansalex.dev/api/rest/page/${pageSize}/${offset}`
  );
  const contracts = await response.json();
  return contracts;
};

function DashboardPage() {
  const [contract, setContract] = useState(null);

  const loadContracts = useCallback(async (offset) => {
    try {
      const contracts = await getContracts(PAGE_SIZE, offset);
      setContract(contracts);
    } catch {
      setContract(null);
    }
  }, []);

  useEffect(() => {
    loadContracts(0);
  }, [loadContracts]);

  // console.log(`contract`, contract);

  return (
    <main className="block-body">
      <ContainerCol>
        <ContainerCardStatisics>
          <CardStatisics
            title="Contracts"
            value={
              contract !== null
                ? formatNumber(contract.contracts_aggregate.aggregate.count)
                : 0
            }
          />
          <CardStatisics
            title="Fees used"
            value={
              contract !== null
                ? formatNumber(contract.contracts_aggregate.aggregate.sum.fees)
                : 0
            }
          />
          <CardStatisics
            title="Gas used"
            value={
              contract !== null
                ? formatNumber(contract.contracts_aggregate.aggregate.sum.gas)
                : 0
            }
          />
          <CardStatisics
            title="Total txs"
            value={
              contract !== null
                ? formatNumber(contract.contracts_aggregate.aggregate.sum.tx)
                : 0
            }
          />
        </ContainerCardStatisics>

        <ContractTable
          contracts={contract !== null ? contract.contracts : []}
        />
      </ContainerCol>
    </main>
  );
}

export default DashboardPage;
