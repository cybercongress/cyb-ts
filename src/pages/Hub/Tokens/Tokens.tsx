import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Display, DisplayTitle } from 'src/components';
import Table from 'src/components/Table/Table';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { HUB_TOKENS } from 'src/constants/hubContracts';
import { useHub } from 'src/contexts/hub';
import { routes } from 'src/routes';
import { EntityToDto } from 'src/types/dto';
import { Token } from 'src/types/hub';
import { trimString } from 'src/utils/utils';

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
        const item = tokens[key];
        return renderRow({
          id: item.id,
          contract: item.contract,
          channelId: item.channel_id,
          chainId: item.chain_id,
          ticker: item.ticker,
          logo: item.logo,
          decimals: item.decimals,
        });
      })
    : [];

  return (
    <Display
      color="blue"
      title={
        <DisplayTitle
          title={
            <Link to={routes.contracts.byAddress.getLink(HUB_TOKENS)}>
              Hub Tokens
            </Link>
          }
        />
      }
    >
      <Table
        data={dataRow}
        columns={useMemo(
          () => [
            columnHelper.accessor('id', {
              header: 'id',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('contract', {
              header: 'contract',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('channelId', {
              header: 'channel id',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('ticker', {
              header: 'ticker',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('logo', {
              header: 'logo',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('decimals', {
              header: 'decimals',
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('chainId', {
              header: 'chain id',
              cell: (info) => info.getValue(),
            }),
          ],
          []
        )}
      />
    </Display>
  );
}

export default Tokens;
