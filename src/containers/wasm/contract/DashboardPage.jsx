import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { formatNumber } from '../../../utils/utils';
import { CardStatisics, Dots } from '../../../components';
import { ContainerCardStatisics, ContainerCol } from '../ui/ui';
import ContractTable from './ContractTable';

const PAGE_SIZE = 50;

const GET_CHARACTERS = gql`
  query MyQuery($offset: Int) {
    contracts(limit: 50, offset: $offset, order_by: { tx: desc }) {
      address
      admin
      code_id
      creator
      fees
      gas
      label
      tx
    }
    contracts_aggregate {
      aggregate {
        sum {
          gas
          fees
          tx
        }
        count(columns: address)
      }
    }
  }
`;

const useGetContracts = (offset) => {
  const [dataContracts, setDataContracts] = useState([]);
  const [dataAggregate, setDataAggregate] = useState(null);
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      offset: offset * PAGE_SIZE,
    },
  });

  if (error) {
    console.log(`Error!`, `Error! ${error.message}`);
  }

  useEffect(() => {
    if (data && data.contracts && data.contracts_aggregate) {
      setDataContracts((items) => [...items, ...data.contracts]);
      if (data.contracts_aggregate.aggregate) {
        setDataAggregate(data.contracts_aggregate.aggregate);
      }
    }
  }, [data]);

  return { dataContracts, dataAggregate, loading };
};

function DashboardPage() {
  const [offset, setOffset] = useState(0);
  const { dataContracts, dataAggregate } = useGetContracts(offset);

  return (
    <main className="block-body">
      <ContainerCol>
        <ContainerCardStatisics>
          <CardStatisics
            title="Contracts"
            value={
              dataAggregate !== null ? (
                formatNumber(dataAggregate.count)
              ) : (
                <Dots />
              )
            }
          />
          <CardStatisics
            title="Fees used"
            value={
              dataAggregate !== null ? (
                formatNumber(dataAggregate.sum.fees)
              ) : (
                <Dots />
              )
            }
          />
          <CardStatisics
            title="Gas used"
            value={
              dataAggregate !== null ? (
                formatNumber(dataAggregate.sum.gas)
              ) : (
                <Dots />
              )
            }
          />
          <CardStatisics
            title="Total txs"
            value={
              dataAggregate !== null ? (
                formatNumber(dataAggregate.sum.tx)
              ) : (
                <Dots />
              )
            }
          />
        </ContainerCardStatisics>

        {dataContracts.length === 0 ? (
          <Dots />
        ) : (
          <ContractTable
            contracts={dataContracts}
            setOffset={setOffset}
            count={dataAggregate !== null ? dataAggregate.count : 0}
          />
        )}
      </ContainerCol>
    </main>
  );
}

export default DashboardPage;
