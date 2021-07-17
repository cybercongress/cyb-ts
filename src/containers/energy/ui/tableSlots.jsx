import React from 'react';
import {
  Pane,
  Text,
  TableEv as Table,
  Tooltip,
  Icon,
} from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trimString, formatNumber } from '../../../utils/utils';
import { NoItems, Dots, TextTable } from '../../../components';
import ValueImg from './valueImg';

const dateFormat = require('dateformat');

const NumberCurrency = ({
  amount,
  fontSizeDecimal,
  currencyNetwork,
  ...props
}) => {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 55px"
      gridGap="5px"
      {...props}
    >
      <Pane whiteSpace="nowrap" display="flex" alignItems="center">
        <span>{formatNumber(Math.floor(amount))}</span>
      </Pane>
      <div style={{ textAlign: 'start' }}>{currencyNetwork.toUpperCase()}</div>
    </Pane>
  );
};

const TableSlots = ({ data, mobile }) => {
  let slotRows = [];

  if (data.length > 0) {
    slotRows = data.map((item, i) => (
      <Table.Row borderBottom="none" display="flex" key={i}>
        <Table.TextCell textAlign="center">
          <TextTable>
            {dateFormat(new Date(item.length), 'dd/mm/yyyy, HH:MM:ss')}
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="center">
          {item.status === 'available' && (
            <TextTable color="#3ab793">Available</TextTable>
          )}
          {item.status !== 'available' && (
            <TextTable>
              <TextTable marginRight={5} color="#ff9100">
                Locked
              </TextTable>{' '}
              {item.status}
            </TextTable>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.volt && (
            <TextTable>
              {formatNumber(item.amount.volt)}
              <ValueImg text="V" onlyImg />
            </TextTable>
          )}
          {item.amount.amper && (
            <TextTable>
              {formatNumber(item.amount.amper)}
              <ValueImg text="A" onlyImg />
            </TextTable>
          )}
        </Table.TextCell>
      </Table.Row>
    ));
  }

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
            <TextTable>
              Time
              <Tooltip content="UTC" position="bottom">
                <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
              </Tooltip>
            </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>State</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Resource</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {slotRows.length > 0 ? slotRows : <NoItems text="No Slots" />}
        </Table.Body>
      </Table>
    </div>
  );
};

export default TableSlots;
