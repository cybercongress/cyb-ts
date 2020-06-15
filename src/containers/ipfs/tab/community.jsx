import React from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table } from '@cybercongress/gravity';
import { TextTable, Cid } from '../../../components';
import { trimString } from '../../../utils/utils';
import Noitem from '../../account/noItem';

function CommunityTab({ data }) {
  if (data.length > 0) {
    const rowItem = data.map((item, i) => (
      <Table.Row
        borderBottom="none"
        display="flex"
        key={`${item.subject}_${i}`}
      >
        <Table.TextCell textAlign="center">
          <TextTable>
            <Link to={`/network/euler/contract/${item.subject}`}>
              {trimString(item.subject, 6, 6)}
            </Link>
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="center">
          <TextTable>
            <Cid cid={item.object_from}>
              {trimString(item.object_from, 6, 6)}
            </Cid>
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="center">
          <TextTable>
            <Cid cid={item.object_to}>{trimString(item.object_to, 6, 6)}</Cid>
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
          <Table.TextHeaderCell textAlign="center">
            <TextTable>accounts</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>incoming links </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>outcoming links</TextTable>
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
  return <Noitem text="No cyberLinks" />;
}

export default CommunityTab;
