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
import { convertResources, formatNumber } from '../../../utils/utils';
import { NoItems, Dots, TextTable, ValueImg } from '../../../components';

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
          {item.status === 'Unfreezing' && (
            <TextTable color="#3ab793">Unfreezing</TextTable>
          )}
          {item.status !== 'Unfreezing' && (
            <TextTable>
              <TextTable marginRight={5} color="#ff9100">
                Liquid
              </TextTable>{' '}
            </TextTable>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="center">
          {item.time && <TextTable>{item.time}</TextTable>}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.hydrogen && (
            <TextTable>
              {formatNumber(item.amount.hydrogen)}
              <ValueImg text="hydrogen" onlyImg />
            </TextTable>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.mvolt && (
            <TextTable>
              {item.amount.mvolt}
              <ValueImg text="mvolt" onlyImg />
            </TextTable>
          )}
          {item.amount.mamper && (
            <TextTable>
              {item.amount.mamper}
              <ValueImg text="mamper" onlyImg />
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
            <TextTable>State</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Unfreezing</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Supplied</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Recieved</TextTable>
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
