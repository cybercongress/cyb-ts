import React from 'react';
import { Pane, Text, TableEv as Table, Tooltip } from '@cybercongress/gravity';
import { GENESIS_SUPPLY, COSMOS } from '../../utils/config';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { TextTable } from '../../components';

const GiftTable = ({ data }) => {
  const rowsTable = data.map((item, i) => (
    <Table.Row borderBottom="none" display="flex" key={i}>
      <Table.TextCell textAlign="end">
        <TextTable fontSize={14}>
          {item.type.indexOf('cosmos') !== -1
            ? formatNumber(Math.floor(item.bal) / COSMOS.DIVISOR_ATOM)
            : formatNumber(Math.floor(item.bal))}{' '}
          {item.type.indexOf('ethereum') !== -1
            ? 'ETH'
            : item.type.indexOf('euler-4') !== -1
            ? 'CYB'
            : item.type.indexOf('cosmos') !== -1
            ? 'ATOMs'
            : item.type}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <Tooltip
          position="bottom"
          content={`${formatNumber(Math.floor(item.gift))} CYB`}
        >
          <TextTable fontSize={14}>
            {formatCurrency(item.gift, 'CYB', 0)}
          </TextTable>
        </Tooltip>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <TextTable fontSize={14}>
          {`${formatNumber((item.gift / GENESIS_SUPPLY) * 100, 4)} %`}
        </TextTable>
      </Table.TextCell>
    </Table.Row>
  ));
  return (
    <Table style={{ width: '100%' }}>
      <Table.Head
        style={{
          backgroundColor: '#000',
          borderBottom: '1px solid #ffffff80',
          padding: 7,
        }}
      >
        <Table.TextHeaderCell textAlign="center">
          <TextTable fontSize={14}>Balance</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable fontSize={14}>CYB Gift</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable fontSize={14}>Control</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {rowsTable}
      </Table.Body>
    </Table>
  );
};

export default GiftTable;
