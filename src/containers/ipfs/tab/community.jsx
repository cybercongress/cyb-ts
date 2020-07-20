import React from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table, Pane } from '@cybercongress/gravity';
import { TextTable, Cid } from '../../../components';
import { trimString } from '../../../utils/utils';
import Noitem from '../../account/noItem';

function CommunityTab({ data }) {
  console.log('data', data);
  if (Object.keys(data).length > 0) {
    const rowItem = Object.keys(data)
      .sort((a, b) => data[b].amount - data[a].amount)
      .map(key => (
        <Table.Row borderBottom="none" display="flex" key={key}>
          <Table.TextCell textAlign="center">
            <TextTable>
              <Link to={`/network/euler/contract/${key}`}>{key}</Link>
            </TextTable>
          </Table.TextCell>
          <Table.TextCell textAlign="end">
            <TextTable>{data[key].amount}</TextTable>
          </Table.TextCell>
        </Table.Row>
      ));

    return (
      <Pane marginX="auto" width="60%" marginY={25}>
        <Pane fontSize="18px">Community</Pane>
        <Table>
          <Table.Head
            style={{
              backgroundColor: '#000',
              borderBottom: '1px solid #ffffff80',
              marginTop: '10px',
              paddingBottom: '10px',
            }}
          >
            <Table.TextHeaderCell textAlign="center">
              <TextTable>accounts</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="center">
              <TextTable>amount of links</TextTable>
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body
            style={{
              backgroundColor: '#000',
              overflowY: 'hidden',
              padding: 7,
            }}
          >
            {rowItem}
          </Table.Body>
        </Table>
      </Pane>
    );
  }
  return <Noitem text="No cyberLinks" />;
}

export default CommunityTab;
