/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import { SubnetInfo } from '../../../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';

import { Account, Cid } from 'src/components';

import { BLOCK_REWARD } from 'src/features/cybernet/constants';
import useDelegate from '../../../hooks/useDelegate';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import GradeSetterInput from '../../Subnet/GradeSetterInput/GradeSetterInput';
import { getAverageGrade, useSubnet } from '../../Subnet/subnet.context';
import { routes as subnetRoutes } from '../../../routes';

type Props = {
  // remove
  data: Props['subnets'];
  subnets: SubnetInfo[];
};

const columnHelper = createColumnHelper<SubnetInfo>();

function F({ value, maxValue }) {
  return (
    <div>
      {value}{' '}
      <span
        style={{
          color: 'gray',
        }}
      >
        / {maxValue}
      </span>
    </div>
  );
}

function SubnetsTable({ data }: Props) {
  const navigate = useNavigate();

  const address = useCurrentAddress();

  const { grades, subnetQuery } = useSubnet();

  const rootSubnet = subnetQuery?.data?.netuid === 0;

  const { data: d2 } = useDelegate(address);
  const myCurrentSubnetsJoined = d2?.registrations;

  const columns = useMemo(() => {
    const col = [
      columnHelper.accessor('netuid', {
        header: '№',
        cell: (info) => {
          const netuid = info.getValue();

          const isMySubnet = myCurrentSubnetsJoined?.includes(netuid);

          return (
            <Link to={subnetRoutes.subnet.getLink(netuid)}>
              {netuid} {isMySubnet && '✅'}
            </Link>
          );
        },
      }),

      columnHelper.accessor('owner', {
        header: 'owner',
        enableSorting: false,
        cell: (info) => {
          const value = info.getValue();

          return (
            <Link to={routes.neuron.getLink(value)}>
              <Account
                address={value}
                avatar
                markCurrentAddress
                // link={'../delegators/' + info.getValue()}
              />
            </Link>
          );
        },
      }),

      columnHelper.accessor('metadata', {
        header: 'metadata',
        enableSorting: false,
        cell: (info) => {
          const cid = info.getValue();

          return (
            <Cid cid={info.getValue()}>
              {`${cid.substr(0, 6)}...${cid.substr(-6)}`}
            </Cid>
          );
        },
      }),
    ];

    if (!rootSubnet) {
      col.push(
        // @ts-ignore
        columnHelper.accessor('max_allowed_validators', {
          header: 'leaders',
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.subnetwork_n;
            const b = rowB.original.subnetwork_n;

            return a - b;
          },
          cell: (info) => {
            const n = info.getValue();

            const current = info.row.original.subnetwork_n;

            return <F value={current} maxValue={n} />;
          },
        }),
        columnHelper.accessor('max_allowed_uids', {
          header: 'operators',
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.subnetwork_n;
            const b = rowB.original.subnetwork_n;

            return a - b;
          },
          cell: (info) => {
            const n = info.getValue();

            const current = info.row.original.subnetwork_n;

            return <F value={current} maxValue={n} />;
          },
        }),

        columnHelper.accessor('emission_values', {
          header: 'Emission block',
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.emission_values;
            const b = rowB.original.emission_values;

            return a - b;
          },

          cell: (info) =>
            `${parseFloat(
              ((info.getValue() / BLOCK_REWARD) * 100).toFixed(2)
            )}%`,
        }),
        // columnHelper.accessor('netuid', {
        //   header: 'link',
        //   cell: (info) => <Link to={'./' + info.getValue()}>link</Link>,
        // }),

        columnHelper.accessor('tempo', {
          header: 'tempo',
          cell: (info) => info.getValue(),
        })
      );
    }

    if (rootSubnet) {
      col.push(
        // @ts-ignore
        columnHelper.accessor('netuid', {
          header: 'Grade (average)',
          id: 'grade',
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.netuid;
            const b = rowB.original.netuid;

            const avgA = getAverageGrade(grades.all.data, a);
            const avgB = getAverageGrade(grades.all.data, b);

            return avgA - avgB;
          },
          cell: (info) => {
            const uid = info.getValue();

            // fix
            if (!grades.all?.data) {
              return 0;
            }

            const avg = getAverageGrade(grades.all.data, uid);

            return avg;
          },
        })
      );

      col.push(
        // @ts-ignore
        columnHelper.accessor('netuid', {
          header: 'Set grade',
          id: 'setGrade',
          enableSorting: false,
          cell: (info) => {
            const uid = info.getValue();
            return <GradeSetterInput uid={uid} />;
          },
        })
      );
    }

    return col;
  }, [myCurrentSubnetsJoined, grades?.all?.data, rootSubnet]);

  return (
    <Table
      onSelect={(row) => navigate(subnetRoutes.subnet.getLink(row))}
      columns={columns}
      data={data}
      // if 1 - root subnet
      enableSorting={data.length !== 1}
    />
  );
}

export default SubnetsTable;
