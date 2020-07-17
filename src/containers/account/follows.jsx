import React from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table } from '@cybercongress/gravity';
import { TextTable, Cid } from '../../components';
import { trimString } from '../../utils/utils';
import Noitem from './noItem';

function FollowsTab({ data }) {
  console.log('data', data);
  if (data.length > 0) {
    const rowItem = data.map(key => (
      <Table.Row borderBottom="none" display="flex" key={key}>
        <Table.TextCell textAlign="start">
          <TextTable>
            <Link to={`/network/euler/contract/${key}`}>{key}</Link>
          </TextTable>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
            marginTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell textAlign="start">
            <TextTable>accounts</TextTable>
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
    );
  }
  return <Noitem text="No follows" />;
}

export default FollowsTab;
