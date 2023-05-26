import { Pane } from '@cybercongress/gravity';
import { LinkWindow, ValueImg } from '../../../components';
import Table from 'src/components/Table/Table';
import { renderTableRows } from './income';
import { DestinationRoute } from '../hooks/useSourceRouted';
import { createColumnHelper } from '@tanstack/react-table';

type Props = {
  sourceRouted: DestinationRoute[];
  selectRouteFunc?: (index: string | null) => void;
};

function Outcome({ sourceRouted, selectRouteFunc }: Props) {
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
