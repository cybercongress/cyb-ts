/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LinkWindow } from 'src/components';
import Table from 'src/components/Table/Table';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/constants';
import { routes } from 'src/routes';
import { trimString } from 'src/utils/utils';

const data = [
  {
    name: 'graph',
    address: CYBERNET_CONTRACT_ADDRESS,
    apr: 35,
    docs: 'https://docs.spacepussy.ai',
    network: 'pussy 🟣',
  },
  {
    name: 'ml',
    address: '-',
    apr: 20,
    docs: 'https://docs.spacepussy.ai',
    network: 'pussy 🟣',
  },
];

const columnHelper = createColumnHelper<(typeof data)[0]>();

function ContractsTable() {
  return (
    <Table
      enableSorting={false}
      columns={useMemo(
        () => [
          columnHelper.accessor('name', {
            header: '',
          }),
          columnHelper.accessor('network', {
            header: '',
          }),
          columnHelper.accessor('apr', {
            header: '',
            cell: (info) => <span>{info.getValue()}%</span>,
          }),
          columnHelper.accessor('docs', {
            header: '',
            cell: (info) => {
              const value = info.getValue();

              return <LinkWindow to={value}>docs</LinkWindow>;
            },
          }),
          columnHelper.accessor('address', {
            header: '',
            cell: (info) => {
              const value = info.getValue();

              if (value === '-') {
                return '-';
              }

              return (
                <Link to={routes.contracts.byId.getLink(value)}>
                  {trimString(value, 9, 3)}
                </Link>
              );
            },
          }),
        ],
        []
      )}
      data={data}
    />
  );
}

export default ContractsTable;
