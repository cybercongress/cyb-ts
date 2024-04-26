import { useHub } from 'src/contexts/hub';
import Table from 'src/components/Table/Table';
import { Network } from 'src/types/hub';
import { useMemo } from 'react';
import { EntityToDto } from 'src/types/dto';
import { createColumnHelper } from '@tanstack/react-table';
import { entityToDto } from 'src/utils/dto';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { Cid } from 'src/components';
import { trimString } from 'src/utils/utils';
import DisplayHub from '../ui/DisplayHub';

const columnHelper = createColumnHelper<EntityToDto<Network>>();

type RenderRow = {
  id: number;
  chainId: string;
  name: string;
  logo: string;
  genesisHash: string;
  prefix: string;
};

function renderRow({
  id,
  chainId,
  name,
  logo,
  prefix,
  genesisHash,
}: RenderRow) {
  return {
    id,
    chainId,
    name,
    logo: (
      <ImgDenom
        coinDenom=""
        tooltipStatus={false}
        infoDenom={{ coinImageCid: logo }}
      />
    ),
    genesisHash: <Cid cid={genesisHash}>{trimString(genesisHash, 6, 6)}</Cid>,
    prefix,
  };
}

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
    <DisplayHub title="Networks" type="HUB_NETWORKS">
      <Table data={dataRow} columns={columnsData} />
    </DisplayHub>
  );
}

export default Networks;
