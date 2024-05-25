/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { Delegator } from 'src/features/cybernet/types';
import { Account, AmountDenom } from 'src/components';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import useCybernetTexts from '../../../useCybernetTexts';
import { cybernetRoutes } from '../../../routes';
import { useCybernet } from '../../../cybernet.context';

type Props = {
  data: Delegator[];
  isLoading: boolean;
};

const columnHelper = createColumnHelper<Delegator>();

function DelegatesTable({ data, isLoading }: Props) {
  const currentAddress = useCurrentAddress();
  const { getText } = useCybernetTexts();

  const { selectedContract, subnetsQuery } = useCybernet();
  const contractName = selectedContract?.metadata?.name;

  function getTotalStake(nominators: Delegator['nominators']) {
    return nominators.reduce((acc, [, stake]) => acc + stake, 0);
  }

  function getMyStake(nominators: Delegator['nominators']) {
    return nominators.find(([address]) => address === currentAddress)?.[1];
  }

  console.log(data);
  console.log(subnetsQuery);
  const subnets = subnetsQuery.data || [];

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
            header: getText('delegate'),
            enableSorting: false,
            cell: (info) => {
              const address = info.getValue();

              return (
                <Account
                  address={address}
                  avatar
                  markCurrentAddress
                  link={cybernetRoutes.delegator.getLink(
                    'pussy',
                    contractName,
                    address
                  )}
                />
              );
            },
          }),

          // columnHelper.accessor('123', {
          //   header: 'APR',
          //   cell: (info) => {
          //     return '10%';
          //   },
          // }),

          columnHelper.accessor('registrations', {
            header: getText('subnetwork', true),
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
                {info.getValue().map((uid) => {
                  const name = subnets.find((subnet) => subnet.netuid === uid)
                    ?.metadata?.name;

                  return (
                    <Link
                      key={uid}
                      to={cybernetRoutes.subnet.getLink(
                        'pussy',
                        contractName,
                        uid
                      )}
                    >
                      {name || uid}
                    </Link>
                  );
                })}
              </div>
            ),
          }),

          columnHelper.accessor('nominators', {
            header: 'pussy power',
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
            header: 'my stake',
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

        [currentAddress, getText, subnets, contractName]
      )}
      data={data}
      isLoading={isLoading}
      initialState={{
        sorting: [
          {
            id: 'stake',
            desc: true,
          },
        ],
      }}
    />
  );
}

export default DelegatesTable;
