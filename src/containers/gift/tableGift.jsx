import React from 'react';
import { Pane, Text, TableEv as Table, Tooltip } from '@cybercongress/gravity';
import { GENESIS_SUPPLY } from '../../utils/config';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { TextTable } from '../../components';

const GiftTable = ({ data }) => {
  const rowsTable = data.map((item, i) => (
    <Table.Row borderBottom="none" display="flex" key={i}>
      <Table.TextCell textAlign="end">
        <TextTable fontSize={14}>
          {formatNumber(Math.floor(item.bal))}{' '}
          {item.type.indexOf('ethereum') !== -1
            ? 'ETH'
            : item.type.indexOf('euler-4') !== -1
            ? 'CYB'
            : item.type.indexOf('cosmos') !== -1
            ? 'ATOMs'
            : item.type}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable fontSize={14}>@SaveTheAles</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <Tooltip
          position="bottom"
          content={`${formatNumber(item.gift * 30)} CYB`}
        >
          <TextTable fontSize={14}>
            {formatCurrency(item.gift * 30, 'CYB', 0)}
          </TextTable>
        </Tooltip>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <TextTable fontSize={14}>
          {`${formatNumber((item.gift / GENESIS_SUPPLY) * 100, 6)} %`}
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
          <TextTable fontSize={14}>Calculation</TextTable>
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
