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
import { trimString, formatNumber } from '../../utils/utils';
import { NoItems, Dots, TextTable } from '../../components';
import { FormatNumber } from './ui';

const dateFormat = require('dateformat');

const NumberCurrency = ({
  amount,
  fontSizeDecimal,
  currencyNetwork,
  ...props
}) => {
  const number = formatNumber(amount);
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 55px"
      gridGap="5px"
      {...props}
    >
      <Pane whiteSpace="nowrap" display="flex" alignItems="center">
        <span>{formatNumber(Math.floor(number))}</span>
      </Pane>
      <div style={{ textAlign: 'start' }}>{currencyNetwork.toUpperCase()}</div>
    </Pane>
  );
};

const TableSlots = ({ data }) => {
  let slotRows = [];

  if (data.length > 0) {
    slotRows = data.map((item, i) => (
      <Table.Row borderBottom="none" display="flex" key={i}>
        <Table.TextCell textAlign="center">
          <TextTable>
            {/* {dateFormat(item.timestamp, 'dd/mm/yyyy, HH:MM:ss')} */}
            {/* {item.length} */}
            {dateFormat(new Date(item.length), 'dd/mm/yyyy, HH:MM:ss')}
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.sboot && (
            <TextTable>
              <FormatNumber fontSizeNumber={16} number={item.amount.sboot} />
            </TextTable>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.volt && (
            <TextTable>
              <NumberCurrency
                amount={item.amount.volt}
                currencyNetwork="Volt"
              />
            </TextTable>
          )}
          {item.amount.amper && (
            <TextTable>
              <NumberCurrency
                amount={item.amount.amper}
                currencyNetwork="amper"
              />
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
              timestamp{' '}
              <Tooltip content="UTC" position="bottom">
                <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
              </Tooltip>
            </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>vested</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>resource</TextTable>
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
