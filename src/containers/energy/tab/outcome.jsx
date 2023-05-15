import { Pane, TableEv as Table } from '@cybercongress/gravity';
import {
  LinkWindow,
  TextTable,
  NoItems,
  Account,
  ValueImg,
} from '../../../components';
import { formatNumber, convertResources } from '../../../utils/utils';

function TableItem({ item, index, selectRouteFunc, selected }) {
  return (
    <Table.Row
      borderBottom="none"
      display="flex"
      key={index}
      onSelect={() => selectRouteFunc(item, index)}
      isSelectable
      boxShadow={selected ? '0px 0px 7px #3ab793db' : ''}
    >
      <Table.TextCell textAlign="start">
        <TextTable>
          <Account address={item.destination} />
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

function Outcome({ sourceRouted, selectRouteFunc, selected }) {
  let routerData = [];

  if (Object.keys(sourceRouted).length > 0) {
    routerData = sourceRouted.map((item, index) => (
      <TableItem
        key={index}
        selected={selected === index}
        selectRouteFunc={selectRouteFunc}
        item={item}
        index={index}
      />
    ));
  }

  return (
    <div>
      <Pane marginY={30} textAlign="center">
        Route your
        <LinkWindow> free energy </LinkWindow> (W) to those who deserve it
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
            <TextTable>Reciever</TextTable>
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

export default Outcome;
