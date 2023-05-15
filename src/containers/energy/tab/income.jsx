import { Pane, TableEv as Table } from '@cybercongress/gravity';
import {
  LinkWindow,
  TextTable,
  NoItems,
  Account,
  ValueImg,
} from '../../../components';
import { formatNumber, convertResources } from '../../../utils/utils';

function TableItem({ item, index }) {
  return (
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
        {item.resource.milliampere ? (
          <TextTable>
            {formatNumber(convertResources(item.resource.milliampere))}
          </TextTable>
        ) : (
          <TextTable>0</TextTable>
        )}
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        {item.resource.millivolt ? (
          <TextTable>
            {formatNumber(convertResources(item.resource.millivolt))}
          </TextTable>
        ) : (
          <TextTable>0</TextTable>
        )}
      </Table.TextCell>
    </Table.Row>
  );
}

function Income({ destinationRoutes, mobile }) {
  let routerData = [];

  if (Object.keys(destinationRoutes).length > 0) {
    routerData = destinationRoutes.map((item, index) => (
      <TableItem item={item} index={index} key={index} />
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
              <ValueImg text="milliampere" />
            </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>
              <ValueImg text="millivolt" />
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
