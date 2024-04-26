import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import Table from 'src/components/Table/Table';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { useHub } from 'src/contexts/hub';
import { EntityToDto } from 'src/types/dto';
import { Token } from 'src/types/hub';
import { trimString } from 'src/utils/utils';
import DisplayHub from '../ui/DisplayHub';
import { entityToDto } from 'src/utils/dto';

const columnHelper = createColumnHelper<EntityToDto<Token>>();

type RenderRow = {
  id: number;
  chainId: string;
  channelId: string;
  ticker: string;
  logo: string;
  contract: string;
  decimals: string;
};

function renderRow({
  id,
  contract,
  channelId,
  ticker,
  logo,
  decimals,
  chainId,
}: RenderRow) {
  return {
    id,
    contract: contract.includes('ibc') ? trimString(contract, 9, 6) : contract,
    channelId,
    ticker,
    logo: (
      <ImgDenom
        coinDenom=""
        tooltipStatus={false}
        infoDenom={{ coinImageCid: logo }}
      />
    ),
    decimals,
    chainId,
  };
}

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
