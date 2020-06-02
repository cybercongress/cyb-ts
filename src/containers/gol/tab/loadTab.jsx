import React from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table } from '@cybercongress/gravity';
import { Loading, TextTable, Dots } from '../../../components';
import { DISTRIBUTION, TAKEOFF } from '../../../utils/config';
import { formatNumber, trimString } from '../../../utils/utils';
import setLeaderboard from '../hooks/leaderboard';

function LoadTab({ takeoffDonations = 0 }) {
  const { data, loading } = setLeaderboard(takeoffDonations);
  console.log(loading);

  const itemTable = Object.keys(data)
    .sort((a, b) => data[b].cybWon - data[a].cybWon)
    .map(key => (
      <Table.Row
        paddingX={0}
        paddingY={5}
        display="flex"
        minHeight="48px"
        borderBottom="none"
        height="fit-content"
        key={key}
      >
        <Table.TextCell flex={2}>
          <TextTable>
            <Link to={`/network/euler/contract/${key}`}>{key}</Link>
          </TextTable>
        </Table.TextCell>
        <Table.TextCell flex={0.5} textAlign="end">
          <TextTable>{formatNumber(Math.floor(data[key].cybWon))}</TextTable>
        </Table.TextCell>
      </Table.Row>
    ));

  return (
    <Table width="100%">
      <Table.Head
        style={{
          backgroundColor: '#000',
          borderBottom: '1px solid #ffffff80',
          marginTop: '10px',
          padding: 7,
          paddingBottom: '10px',
        }}
      >
        <Table.TextHeaderCell flex={2} textAlign="center">
          <TextTable>Address</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={0.5} textAlign="center">
          <TextTable>CYB won</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {loading ? <Dots /> : Object.keys(data).length > 0 && itemTable}
      </Table.Body>
    </Table>
  );
}

export default LoadTab;
