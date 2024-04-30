import React, { useMemo } from 'react';
import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { Delegator } from 'src/features/cybernet/types';
import { routes } from 'src/routes';
import { Account, AmountDenom, FormatNumberTokens } from 'src/components';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

type Props = {
  data: Delegator[];
};

const columnHelper = createColumnHelper<any>();

function DelegatorsTable({ data }: Props) {
  console.log(data);

  const currentAddress = useCurrentAddress();

  const navigate = useNavigate();
  return (
    <div>
      <Table
        // onSelect={(row) => navigate(`/delegators/${row}`)}
        columns={useMemo(
          () => [
            columnHelper.accessor('uid', {
              header: 'uid',
              cell: ({ row }) => {
                return row.index;
              },
            }),

            columnHelper.accessor('delegate', {
              header: 'delegate',
              cell: (info) => (
                <Account
                  address={info.getValue()}
                  avatar
                  link={'../delegators/' + info.getValue()}
                />
              ),
            }),

            columnHelper.accessor('123', {
              header: 'APR',
              cell: (info) => {
                return '10%';
              },
            }),

            columnHelper.accessor('registrations', {
              header: 'Subnets',
              cell: (info) => (
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                  }}
                >
                  <>
                    {info.getValue().map((val) => {
                      return <Link to={'../subnets/' + val}>{val}</Link>;
                    })}
                  </>
                </div>
              ),
            }),

            columnHelper.accessor('nominators', {
              header: 'total stake',
              cell: (info) => {
                const nominators = info.getValue();
                const total = nominators.reduce(
                  (acc, [_, stake]) => acc + stake,
                  0
                );

                return <AmountDenom amountValue={total} denom="space-pussy" />;
              },
            }),
            // my stake

            columnHelper.accessor('nominators', {
              header: 'my stake',
              cell: (info) => {
                const nominators = info.getValue();
                const myStake = nominators.find(
                  ([address, stake]) => address === currentAddress
                );

                return (
                  myStake && (
                    <AmountDenom amountValue={myStake[1]} denom="space-pussy" />
                  )
                );
              },
            }),
          ],

          [currentAddress]
        )}
        data={data}
      />
    </div>
  );
}

export default DelegatorsTable;
