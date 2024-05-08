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
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('destinationChainId', {
        header: 'destination chain id',
      }),
      columnHelper.accessor('destinationChannelId', {
        header: 'destination channel id',
      }),
      columnHelper.accessor('sourceChainId', {
        header: 'source chain id',
      }),
      columnHelper.accessor('sourceChannelId', {
        header: 'source channel id',
      }),
    ];
  }, []);

  return (
    <DisplayHub title="channels" type="HUB_CHANNELS">
      <Table columns={columnsData} data={dataRow} />
    </DisplayHub>
  );
}

export default Channels;
