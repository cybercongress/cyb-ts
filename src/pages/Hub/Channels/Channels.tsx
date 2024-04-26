import { useHub } from 'src/contexts/hub';
import { Channel } from 'src/types/hub';
import { EntityToDto } from 'src/types/dto';
import { entityToDto } from 'src/utils/dto';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { useMemo } from 'react';
import DisplayHub from '../ui/DisplayHub';
import renderRow from './map';

const columnHelper = createColumnHelper<EntityToDto<Channel>>();

function Channels() {
  const { channels } = useHub();

  const dataRow = channels
    ? Object.keys(channels).map((key) => {
        const item = entityToDto(channels[key]);
        return renderRow(item);
      })
    : [];

  const columnsData = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        header: 'id',
      }),
      columnHelper.accessor('active', {
        header: 'active',
      }),
      columnHelper.accessor('destinationChainId', {
        header: 'destinationChainId',
      }),
      columnHelper.accessor('destinationChannelId', {
        header: 'destinationChannelId',
      }),
      columnHelper.accessor('sourceChainId', {
        header: 'sourceChainId',
      }),
      columnHelper.accessor('sourceChannelId', {
        header: 'sourceChannelId',
      }),
    ];
  }, []);

  return (
    <DisplayHub title="Channels" type="HUB_CHANNELS">
      <Table columns={columnsData} data={dataRow} />
    </DisplayHub>
  );
}

export default Channels;
