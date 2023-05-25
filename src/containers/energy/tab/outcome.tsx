import { Pane } from '@cybercongress/gravity';
import {
  LinkWindow,
  TextTable,
  NoItems,
  Account,
  ValueImg,
} from '../../../components';
import { formatNumber, convertResources } from '../../../utils/utils';
import Table from 'src/components/Table/Table';
import { renderTableRows } from './income';
import { DestinationRoute } from '../hooks/useSourceRouted';
import { createColumnHelper } from '@tanstack/react-table';

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

type Props = {
  sourceRouted: DestinationRoute[];
  selectRouteFunc: (index: number) => void;
  selected: any;
};

function Outcome({ sourceRouted, selectRouteFunc }: Props) {
  console.log('sourceRouted', sourceRouted);

  const routerData = sourceRouted.map(({ resource, destination, name }) =>
    renderTableRows({ resource, address: destination, alias: name })
  );

  const columnHelper = createColumnHelper<any>();

  return (
    <div>
      <Pane marginY={30} textAlign="center">
        Route your
        <LinkWindow> free energy </LinkWindow> (W) to those who deserve it
      </Pane>

      <Table
        onSelect={selectRouteFunc}
        columns={[
          columnHelper.accessor('address', {
            header: 'Receiver',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('alias', {
            header: 'Alias',
          }),
          columnHelper.accessor('milliampere', {
            header: (
              <span
                style={{
                  textTransform: 'capitalize',
                }}
              >
                <ValueImg text="milliampere" />
              </span>
            ),
          }),
          columnHelper.accessor('millivolt', {
            header: (
              <span
                style={{
                  textTransform: 'capitalize',
                }}
              >
                <ValueImg text="millivolt" />
              </span>
            ),
          }),
        ]}
        data={routerData}
      />
    </div>
  );
}

export default Outcome;
