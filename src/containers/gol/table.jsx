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
  Takeoff,
  Total,
} from './discipline';

const BLOCK_SUBSCRIPTION = gql`
  query newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

const TableDiscipline = ({
  won = 0,
  addressLedger,
  validatorAddress,
  consensusAddress,
  takeoffDonations,
  estimation,
}) => {
  try {
    const { loading, data: dataBlock } = useQuery(BLOCK_SUBSCRIPTION);

    if (loading) {
      return <Dots />;
    }
    return (
      <Pane marginTop={15} width="100%">
        <Table>
          <Table.Head
            style={{
              backgroundColor: '#000',
              borderBottom: '1px solid #ffffff80',
              paddingBottom: '15px',
            }}
          >
            <Table.TextHeaderCell textAlign="center">
              <Text fontSize="16px" color="#fff">
                Discipline
              </Text>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="center">
              <Text fontSize="16px" color="#fff">
                Max CYB reward
              </Text>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="center">
              <Text fontSize="16px" color="#fff">
                Current CYB reward
              </Text>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="center">
              <Text fontSize="16px" color="#fff">
                CYB won
              </Text>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="center">
              <Text fontSize="16px" color="#fff">
                CYB won, %
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
            <Takeoff
              takeoffDonations={takeoffDonations}
              addressLedger={addressLedger}
              estimation={estimation}
            />
            <Relevance
              dataBlock={dataBlock.block[0].height}
              addressLedger={addressLedger}
              takeoffDonations={takeoffDonations}
            />
            <Load
              addressLedger={addressLedger}
              takeoffDonations={takeoffDonations}
            />
            <Delegation
              validatorAddress={validatorAddress}
              takeoffDonations={takeoffDonations}
            />
            <LifetimeHooks
              consensusAddress={consensusAddress}
              takeoffDonations={takeoffDonations}
            />
            <Rewards
              validatorAddress={validatorAddress}
              takeoffDonations={takeoffDonations}
            />
            <FVS />
            <CommunityPool />
            <Total />
          </Table.Body>
        </Table>
      </Pane>
    );
  } catch (error) {
    return <div>oops</div>;
  }
};

export default TableDiscipline;
