import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { GENESIS_SUPPLY } from '../../utils/config';
import { formatNumber } from '../../utils/utils';
import { TextTable } from '../../components';

const giftImg = require('../../image/gift.svg');

const KEY_NAME = {
  'euler-4_bal': 'CYB',
  cosmos_bal: 'ATOMs',
  cosmos_gift: 'cosmos gift',
  ethereum_bal: 'ETH',
  ethereum_gift: 'eth gift',
  galaxies: 'galaxies',
  galaxies_gift: 'galaxies gift',
  stars: 'stars',
  stars_gift: 'stars gift',
  planets: 'planets',
  planets_gift: 'planets gift',
};

const GiftTable = ({ data }) => {
  console.log(data);
  const rowsTable = data.map((item, i) => (
    <Table.Row borderBottom="none" display="flex" key={i}>
      <Table.TextCell textAlign="center">
        <TextTable>
          {Object.keys(item).map(
            key =>
              key.indexOf('gift') === -1 &&
              `${Math.floor(item[key])} ${KEY_NAME[key]}`
          )}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>@SaveTheAles</TextTable>
      </Table.TextCell>
      <TextTable>
        {Object.keys(item).map(
          key => key.indexOf('gift') !== -1 && `${formatNumber(item[key])} CYB`
        )}
      </TextTable>
      <Table.TextCell textAlign="center">
        <TextTable>
          {Object.keys(item).map(
            key =>
              key.indexOf('gift') !== -1 &&
              `${formatNumber((item[key] / GENESIS_SUPPLY) * 100, 6)} %`
          )}
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
          marginTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Balance</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Calculation</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>CYB Gift</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>Control</TextTable>
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
