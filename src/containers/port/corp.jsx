import React from 'react';
import { TableEv as Table } from '@cybercongress/gravity';
import { TextTable } from '../../components';
import { what, cyber, your } from './gov';

function Corp() {
  return (
    <Table>
      <Table.Head
        style={{
          backgroundColor: '#000',
          borderBottom: '1px solid #fff',
          marginTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <Table.TextHeaderCell textAlign="center">
          <TextTable />
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Cyber</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Your gov</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {what.map((item, i) => (
          <Table.Row borderBottom="none" display="flex" key={item}>
            <Table.TextCell textAlign="start">
              <TextTable>{item}</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="center">
              <TextTable>{cyber[i]}</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="center">
              <TextTable>{your[i]}</TextTable>
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default Corp;
