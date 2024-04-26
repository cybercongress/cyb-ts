import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import Table from 'src/components/Table/Table';
import { useHub } from 'src/contexts/hub';
import { EntityToDto } from 'src/types/dto';
import { Token } from 'src/types/hub';
import DisplayHub from '../ui/DisplayHub';
import { entityToDto } from 'src/utils/dto';
import renderRow from './map';

const columnHelper = createColumnHelper<EntityToDto<Token>>();


function Tokens() {
  const { tokens } = useHub();

  const dataRow = tokens
    ? Object.keys(tokens).map((key) => {
        const item = entityToDto(tokens[key]);
        return renderRow(item);
      })
    : [];

  return (
    <DisplayHub title="Tokens" type="HUB_TOKENS">
      <Table
        data={dataRow}
        columns={useMemo(
          () => [
            columnHelper.accessor('id', {
              header: 'id',
            }),
            columnHelper.accessor('contract', {
              header: 'contract',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('channelId', {
              header: 'channel id',
            }),
            columnHelper.accessor('ticker', {
              header: 'ticker',
            }),
            columnHelper.accessor('logo', {
              header: 'logo',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('decimals', {
              header: 'decimals',
            }),
            columnHelper.accessor('chainId', {
              header: 'chain id',
            }),
          ],
          []
        )}
      />
    </DisplayHub>
  );
}

export default Tokens;
