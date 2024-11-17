import { createColumnHelper } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { FormatNumber, FormatNumberTokens } from 'src/components';
import { ValidatorTableData } from '../../types/tableData';
import Moniker from './ui/Moniker/Moniker';
import VotingPower from './ui/VotingPower/VoitingPower';

const columnHelper = createColumnHelper<ValidatorTableData>();

const renderColumnsData = () => [
  columnHelper.accessor('id', {
    header: 'id',
    size: 70,
    cell: (info) => {
      const { id, rank } = info.row.original;
      return (
        <span
          style={{
            color:
              rank === '33' ? '#FF0000' : rank === '67' ? '#FFCA42' : '#fff',
            fontSize: '14px',
          }}
        >
          {id}
        </span>
      );
    },
  }),
  columnHelper.accessor('description.moniker', {
    header: 'moniker',
    enableSorting: false,
    cell: (info) => {
      const { status } = info.row.original;
      const { operatorAddress } = info.row.original;
      return (
        <Moniker
          data={info.cell.row.original.description}
          status={status}
          operatorAddress={operatorAddress}
        />
      );
    },
  }),
  columnHelper.accessor('tokens', {
    header: 'Power',
    sortingFn: (rowA, rowB) => {
      const a = parseFloat(rowA.original.tokens);
      const b = parseFloat(rowB.original.tokens);
      return a - b;
    },
    cell: (info) => {
      return <VotingPower data={info.row.original} />;
    },
  }),
  columnHelper.accessor('commission.commissionRates', {
    header: 'Commission',
    size: 130,
    sortingFn: (rowA, rowB) => {
      const a = parseFloat(rowA.original.commission.commissionRates.rate);
      const b = parseFloat(rowB.original.commission.commissionRates.rate);
      return a - b;
    },
    cell: (info) => {
      const val = info.getValue();
      return (
        <FormatNumber
          currency="%"
          number={new BigNumber(val.rate)
            .multipliedBy(100)
            .dp(2, BigNumber.ROUND_FLOOR)
            .toFixed(2)}
        />
      );
    },
  }),
  columnHelper.accessor('apr', {
    header: 'APR',
    size: 80,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.apr;
      const b = rowB.original.apr;
      return a - b;
    },
    cell: (info) => {
      const val = info.getValue();
      return (
        <FormatNumber
          currency="%"
          number={new BigNumber(val)
            .multipliedBy(100)
            .dp(2, BigNumber.ROUND_FLOOR)
            .toFixed(2)}
        />
      );
    },
  }),
  columnHelper.accessor('delegation', {
    header: 'Your bond',
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.delegation?.amount
        ? parseFloat(rowA.original.delegation.amount)
        : 0;
      const b = rowB.original.delegation?.amount
        ? parseFloat(rowB.original.delegation.amount)
        : 0;
      return a - b;
    },
    cell: (info) => {
      const item = info.getValue();
      return item ? (
        <FormatNumberTokens text={item.denom} value={parseFloat(item.amount)} />
      ) : (
        ''
      );
    },
  }),
];

export default renderColumnsData;
