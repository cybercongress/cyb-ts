import React from 'react';
import { Text, TableEv as Table } from '@cybercongress/gravity';

import { formatValidatorAddress, formatCurrency } from '../../utils/utils';

const TextTable = ({ children, fontSize, color, display, ...props }) => (
  <Text
    fontSize={`${fontSize || 14}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    {...props}
  >
    {children}
  </Text>
);

const TableVesting = ({ data }) => {
  const tableRow = data.map(item => (
    <Table.Row borderBottom="none" key={item.id} isSelectable>
      <Table.TextCell flex="none" width="70px">
        <TextTable>{item.id}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="end" flex={0.5}>
        <TextTable>{formatCurrency(item.amount)}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>{item.start}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <a
            href={`https://cyberd.ai/account/${item.recipient}`}
            target="_blank"
          >
            {formatValidatorAddress(item.recipient, 8, 4)}
          </a>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell>
        <TextTable>{item.proof}</TextTable>
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
          padding: 7,
        }}
      >
        <Table.TextHeaderCell flex="none" textAlign="center" width="70px">
          <TextTable>ID</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center" flex={0.5}>
          <TextTable>Amount</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Date</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>CYBER Recipient</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Proof TX</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {tableRow}
      </Table.Body>
    </Table>
  );
};

export default TableVesting;
