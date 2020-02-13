import React, { useState } from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { CardTemplate, Cid } from '../../components';

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
    <Table.Row borderBottom="none" display="flex" key={item.txhash}>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Link to={`/txs/${item.txhash}`}>
            {formatValidatorAddress(item.txhash, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          {dateFormat(item.timestamp, 'dd/mm/yyyy, hh:MM:ss tt "UTC"')}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.object_to}>
            {formatValidatorAddress(item.object_to, 6, 6)}
          </Cid>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.object_from}>
            {formatValidatorAddress(item.object_from, 6, 6)}
          </Cid>
        </TextTable>
      </Table.TextCell>
    </Table.Row>
  ));

  return (
    <div>
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
    </div>
  );
};

export default TableLink;
