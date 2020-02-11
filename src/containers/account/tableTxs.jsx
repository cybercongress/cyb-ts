import React, { useState } from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { CardTemplate, MsgType } from '../../components';
import Noitem from './noItem';

const dateFormat = require('dateformat');
const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

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

const TableTxs = ({ data, type }) => {
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
      <Table.TextCell flex={0.5} textAlign="center">
        <TextTable>
          <img
            style={{ width: '20px', height: '20px', marginRight: '5px' }}
            src={item.code === 0 ? statusTrueImg : statusFalseImg}
            alt="statusImg"
          />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="start">
        <TextTable>
          <MsgType type={item.message.type} />
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
            padding: 7,
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={0.7} textAlign="center">
            <TextTable flex={0.5}>status</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>type</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>height</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>timestamp</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {data.length > 0 ? validatorRows : <Noitem text={`No txs ${type}`} />}
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

export default TableTxs;
