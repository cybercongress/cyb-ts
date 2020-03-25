import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Dots } from '../../components';
import {
  Load,
  Delegation,
  LifetimeHooks,
  Rewards,
  FVS,
  Relevance,
  CommunityPool,
} from './discipline';

const BLOCK_SUBSCRIPTION = gql`
  query newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

const TableDiscipline = ({
  won,
  addressLedger,
  validatorAddress,
  consensusAddress,
}) => {
  const { loading, data: dataBlock } = useQuery(BLOCK_SUBSCRIPTION);

  if (loading) {
    return <Dots />;
  }

  return (
    <Pane width="100%">
      <Pane textAlign="center" width="100%">
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Allocations of CYB rewards by discipline
        </Text>
      </Pane>
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              Discipline
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              CYB reward
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              Current Prize
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              cyb won absolute
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              cyb won percent
            </Text>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          <Relevance
            dataBlock={dataBlock.block[0].height}
            addressLedger={addressLedger}
            won={won}
          />
          <Load addressLedger={addressLedger} won={won} />
          <Delegation validatorAddress={validatorAddress} won={won} />
          <LifetimeHooks consensusAddress={consensusAddress} won={won} />
          <Rewards validatorAddress={validatorAddress} won={won} />
          <FVS />
          <CommunityPool />
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default TableDiscipline;
