import { useHub } from 'src/contexts/hub';
import Table from 'src/components/Table/Table';
import { Network } from 'src/types/hub';
import { useMemo } from 'react';
import { EntityToDto } from 'src/types/dto';
import { createColumnHelper } from '@tanstack/react-table';
import { entityToDto } from 'src/utils/dto';
import DisplayHub from '../ui/DisplayHub';
import renderRow from './map';

const columnHelper = createColumnHelper<EntityToDto<Network>>();

function Networks() {
  const { networks } = useHub();

  const dataRow = networks
    ? Object.keys(networks).map((key) => {
        const item = entityToDto(networks[key]);
        return renderRow(item);
      })
    : [];

  const columnsData = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'id',
      }),
      columnHelper.accessor('chainId', {
        header: 'chainId',
      }),
      columnHelper.accessor('name', {
        header: 'name',
      }),
      columnHelper.accessor('logo', {
        header: 'logo',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('genesisHash', {
        header: 'genesisHash',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('prefix', {
        header: 'prefix',
      }),
    ],
    []
  );

  return (
    <DisplayHub title="networks" type="HUB_NETWORKS">
      <Table data={dataRow} columns={columnsData} />
    </DisplayHub>
  );
}

export default Networks;
