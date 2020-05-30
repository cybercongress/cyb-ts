import React from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table } from '@cybercongress/gravity';
import { Loading, TextTable } from '../../../components';
import { DISTRIBUTION, TAKEOFF } from '../../../utils/config';
import { formatNumber, trimString } from '../../../utils/utils';
import setLeaderboard from '../hooks/leaderboard';

function LoadTab({ takeoffDonations = 0 }) {
  const data = setLeaderboard(takeoffDonations);

  console.log('LoadTab', data);

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
          <TextTable>Load, ‱</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={0.5} textAlign="center">
          <TextTable>Karma</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={0.5} textAlign="center">
          <TextTable>CYB won</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      {/* <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {data.map((item, index) => {
          let load = 0;
          let cybWonAbsolute = 0;
          let control = 0;
          if (sumKarma > 0) {
            load = parseFloat(item.karma) / parseFloat(sumKarma);
            cybWonAbsolute = load * currentPrize;
            control = (cybWonAbsolute / DISTRIBUTION.load) * 10000;
          }

          return (
            <Table.Row
              paddingX={0}
              paddingY={5}
              borderBottom={item.local ? '1px solid #3ab793bf' : 'none'}
              display="flex"
              minHeight="48px"
              height="fit-content"
              key={(item.subject, index)}
            >
              <Table.TextCell flex={2}>
                <TextTable>
                  <Link to={`/network/euler/contract/${item.subject}`}>
                    {item.subject}
                  </Link>
                </TextTable>
              </Table.TextCell>
              <Table.TextCell flex={0.5} textAlign="end">
                <TextTable>{formatNumber(control, 4)}</TextTable>
              </Table.TextCell>
              <Table.TextCell flex={0.5} textAlign="end">
                <TextTable>{formatNumber(item.karma)}</TextTable>
              </Table.TextCell>
              <Table.TextCell flex={0.5} textAlign="end">
                <TextTable>
                  {formatNumber(Math.floor(cybWonAbsolute))}
                </TextTable>
              </Table.TextCell>
            </Table.Row>
          );
        })}
      </Table.Body> */}
    </Table>
  );
}

export default LoadTab;
