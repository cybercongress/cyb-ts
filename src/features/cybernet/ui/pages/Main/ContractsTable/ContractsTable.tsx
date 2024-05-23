/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AmountDenom, DenomArr, LinkWindow } from 'src/components';
import Table from 'src/components/Table/Table';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/constants';
import { routes } from 'src/routes';
import { trimString } from 'src/utils/utils';
import { useCybernet } from '../../../cybernet.context';
import ImgDenom from 'src/components/valueImg/imgDenom';

const columnHelper = createColumnHelper<(typeof data)[0]>();

function ContractsTable() {
  const { contracts, selectContract } = useCybernet();

  return (
    <Table
      onSelect={(row) => {
        const address = contracts[row!]
          ? contracts[row!].address
          : CYBERNET_CONTRACT_ADDRESS;
        selectContract(address);
      }}
      enableSorting={false}
      columns={useMemo(
        () => [
          columnHelper.accessor('name', {
            header: '',
          }),
          columnHelper.accessor('apr', {
            header: '',
            cell: (info) => <span>30%</span>,
          }),
          columnHelper.accessor('docs', {
            header: '',
            cell: (info) => {
              // const value = info.getValue();
              const value = 'https://docs.spacepussy.ai';

              return <LinkWindow to={value}>docs</LinkWindow>;
            },
          }),
          columnHelper.accessor('network', {
            header: '',
            cell: (info) => {
              const value = info.getValue();

              return <DenomArr type="network" denomValue={value} />;
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
      data={contracts}
    />
  );
}

export default ContractsTable;
