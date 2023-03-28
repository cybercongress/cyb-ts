import React from 'react';
import { Pane, TableEv as Table } from '@cybercongress/gravity';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import { NoItems, TextTable, ValueImg } from '../../../components';
import { CYBER } from '../../../utils/config';

const dateFormat = require('dateformat');

function NumberCurrency({
  amount,
  fontSizeDecimal,
  currencyNetwork,
  ...props
}) {
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
}

function TableSlots({ data, traseDenom }) {
  const { coinDecimals: coinDecimalsA } = traseDenom('milliampere');
  const { coinDecimals: coinDecimalsV } = traseDenom('millivolt');

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
          {item.amount[CYBER.DENOM_LIQUID_TOKEN] && (
            <TextTable>
              {formatNumber(item.amount[CYBER.DENOM_LIQUID_TOKEN])}
              <ValueImg text={CYBER.DENOM_LIQUID_TOKEN} onlyImg />
            </TextTable>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.amount.millivolt && (
            <TextTable>
              {getDisplayAmount(item.amount.millivolt, coinDecimalsV)}
              <ValueImg text="millivolt" onlyImg />
            </TextTable>
          )}
          {item.amount.milliampere && (
            <TextTable>
              {getDisplayAmount(item.amount.milliampere, coinDecimalsA)}
              <ValueImg text="milliampere" onlyImg />
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
}

export default TableSlots;
