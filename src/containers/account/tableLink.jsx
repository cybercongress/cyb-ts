import React, { useState } from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { Link, Cid } from '../../components';
import CardTemplate from './cardTemplate';

const dateFormat = require('dateformat');
const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');

const TextTable = ({ children, fontSize, color, display, ...props }) => (
  <Text
    fontSize={`${fontSize || 13}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    {...props}
  >
    {children}
  </Text>
);

const TableLink = ({ data }) => {
  const [seeAll, setSeeAll] = useState(false);

  const validatorRows = data.slice(0, seeAll ? data.length : 5).map(item => (
    <Table.Row borderBottom="none" display="flex" key={item.transaction}>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Link to={`#/txs/${item.transaction}`}>
            {formatValidatorAddress(item.transaction, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={0.7} textAlign="center">
        <TextTable>{formatNumber(item.height)}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          {dateFormat(item.timestamp, 'dd/mm/yyyy, h:MM:ss TT')}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.cid_to}>
            {formatValidatorAddress(item.cid_to, 6, 6)}
          </Cid>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.cid_from}>
            {formatValidatorAddress(item.cid_from, 6, 6)}
          </Cid>
        </TextTable>
      </Table.TextCell>
    </Table.Row>
  ));

  return (
    <CardTemplate paddingBottom={10} title="Link">
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
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={0.7} textAlign="center">
            <TextTable>height</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>timestamp</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>from</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>to</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {validatorRows}
        </Table.Body>
      </Table>
      {data.length > 1 && (
        <button
          style={{
            width: '25px',
            height: '25px',
            margin: 0,
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent',
          }}
          type="button"
          onClick={() => setSeeAll(!seeAll)}
        >
          <img src={!seeAll ? imgDropdown : imgDropup} alt="imgDropdown" />
        </button>
      )}
    </CardTemplate>
  );
};

export default TableLink;
