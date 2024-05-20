/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { Delegator } from 'src/features/cybernet/types';
import { Account, AmountDenom } from 'src/components';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

type Props = {
  data: Delegator[];
  isLoading: boolean;
};

const columnHelper = createColumnHelper<Delegator>();

function DelegatorsTable({ data, isLoading }: Props) {
  console.log(data);

  const currentAddress = useCurrentAddress();

  function getTotalStake(nominators: Delegator['nominators']) {
    return nominators.reduce((acc, [, stake]) => acc + stake, 0);
  }

  function getMyStake(nominators: Delegator['nominators']) {
    return nominators.find(([address]) => address === currentAddress)?.[1];
  }

  const navigate = useNavigate();
  return (
    <Table
      onSelect={(row) => navigate(`./${data.find((_, i) => i == row)?.owner}`)}
      columns={useMemo(
        () => [
          columnHelper.accessor((row) => row, {
            header: '№',
            cell: ({ row }) => {
              return row.index;
            },
          }),

          columnHelper.accessor('delegate', {
            header: 'operator',
            enableSorting: false,
            cell: (info) => (
              <Account
                address={info.getValue()}
                avatar
                markCurrentAddress
                link={'../delegators/' + info.getValue()}
              />
            ),
          }),

          // columnHelper.accessor('123', {
          //   header: 'APR',
          //   cell: (info) => {
          //     return '10%';
          //   },
          // }),

          columnHelper.accessor('registrations', {
            header: 'Joined subnets',
            sortingFn: (rowA, rowB) => {
              const a = rowA.original.registrations.length;
              const b = rowB.original.registrations.length;

              return a - b;
            },
            cell: (info) => (
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                }}
              >
                {info.getValue().map((val) => {
                  return (
                    <Link key={val} to={'../subnets/' + val}>
                      {val}
                    </Link>
                  );
                })}
              </div>
            ),
          }),

          columnHelper.accessor('nominators', {
            header: 'pussy stake',
            id: 'stake',
            sortingFn: (rowA, rowB) => {
              const totalA = getTotalStake(rowA.original.nominators);
              const totalB = getTotalStake(rowB.original.nominators);

              return totalA - totalB;
            },
            cell: (info) => {
              const nominators = info.getValue();
              const total = getTotalStake(nominators);

              return <AmountDenom amountValue={total} denom="pussy" />;
            },
          }),
          columnHelper.accessor('nominators', {
            header: 'my investment',
            id: 'myStake',
            sortingFn: (rowA, rowB) => {
              const myStakeA = getMyStake(rowA.original.nominators) || 0;
              const myStakeB = getMyStake(rowB.original.nominators) || 0;

              return myStakeA - myStakeB;
            },
            cell: (info) => {
              const nominators = info.getValue();
              const myStake = getMyStake(nominators);

              if (!myStake) {
                return null;
              }

              return <AmountDenom amountValue={myStake} denom="pussy" />;
            },
          }),
        ],

        [currentAddress]
      )}
      data={data}
      isLoading={isLoading}
      initialState={{
        sorting: [
          {
            id: 'nominators',
            desc: true,
          },
        ],
      }}
    />
  );
}

export default DelegatorsTable;
