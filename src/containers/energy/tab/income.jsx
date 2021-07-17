import React from 'react';
import { Pane, TableEv as Table } from '@cybercongress/gravity';
import { ValueImg } from '../ui';
import { LinkWindow, TextTable, NoItems, Account } from '../../../components';
import { formatNumber } from '../../../utils/utils';

const TableItem = ({ item, index }) => (
  <Table.Row borderBottom="none" display="flex" key={index}>
    <Table.TextCell textAlign="start">
      <TextTable>
        <Account address={item.source} />
      </TextTable>
    </Table.TextCell>
    <Table.TextCell textAlign="center">
      <TextTable>{item.alias}</TextTable>
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      {item.resource.amper ? (
        <TextTable>{formatNumber(item.resource.volt)}</TextTable>
      ) : (
        <TextTable>0</TextTable>
      )}
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      {item.resource.volt ? (
        <TextTable>{formatNumber(item.resource.volt)}</TextTable>
      ) : (
        <TextTable>0</TextTable>
      )}
    </Table.TextCell>
  </Table.Row>
);

function Income({ destinationRoutes, mobile }) {
  let routerData = [];

  if (Object.keys(destinationRoutes).length > 0) {
    routerData = destinationRoutes.map((item, index) => (
      <TableItem item={item} index={index} />
    ));
  }

  return (
    <div>
      <Pane marginY={30} textAlign="center">
        These
        <LinkWindow> energy </LinkWindow> (W) was route to you
      </Pane>

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
            <TextTable>Transmitter</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Alias</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>
              <ValueImg text="A" />
            </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>
              <ValueImg text="V" />
            </TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {routerData.length > 0 ? routerData : <NoItems text="No Routes" />}
        </Table.Body>
      </Table>
    </div>
  );
}

export default Income;
