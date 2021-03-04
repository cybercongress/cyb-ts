import React from 'react';
import { TableEv as Table } from '@cybercongress/gravity';
import { TextTable } from '../../components';
import { what, cyber, google } from './tableCyberData';

function Cyber() {
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
          <TextTable>What</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Google</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Cyber</TextTable>
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
              <TextTable color="#d50000">{google[i]}</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="center">
              <TextTable
                color={
                  i === 13 || i === 16 || i === 19 || i === 26
                    ? '#ffc400'
                    : '#1eff00'
                }
              >
                {cyber[i]}
              </TextTable>
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default Cyber;
