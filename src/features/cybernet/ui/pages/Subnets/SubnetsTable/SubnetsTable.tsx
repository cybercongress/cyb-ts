/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import { SubnetInfo } from '../../../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';

import { Account, Cid, Tooltip } from 'src/components';

import { BLOCK_REWARD } from 'src/features/cybernet/constants';
import useDelegate from '../../../hooks/useDelegate';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import GradeSetterInput from '../../Subnet/GradeSetterInput/GradeSetterInput';
import { getAverageGrade, useSubnet } from '../../Subnet/subnet.context';
import { routes as subnetRoutes } from '../../../routes';
import useCybernetTexts from '../../../useCybernetTexts';
import { useCurrentContract, useCybernet } from '../../../cybernet.context';
import SubnetPreview from '../../../components/SubnetPreview/SubnetPreview';
import CIDResolver from 'src/components/CIDResolver/CIDResolver';
import { trimString } from 'src/utils/utils';

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

  const { getText } = useCybernetTexts();

  const rootSubnet = subnetQuery?.data?.netuid === 0;

  const { data: d2 } = useDelegate(address);
  const myCurrentSubnetsJoined = d2?.registrations;

  const myAddressJoinedRootSubnet = myCurrentSubnetsJoined?.includes(0);

  const { selectedContract } = useCybernet();

  const { contractName, network } = useCurrentContract();

  const columns = useMemo(() => {
    const col = [
      columnHelper.accessor('metadata', {
        header: 'name',
        id: 'subnetName',
        cell: (info) => {
          const value = info.getValue();

          const { netuid } = info.row.original;

          const isMySubnet = myCurrentSubnetsJoined?.includes(netuid);

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0 7px',
              }}
            >
              <SubnetPreview subnetUID={netuid} withName />
              {isMySubnet && (
                <Tooltip tooltip={`you joined this ${getText('subnetwork')}`}>
                  ✅
                </Tooltip>
              )}
            </div>
          );
        },
      }),

      columnHelper.accessor('owner', {
        header: getText('subnetOwner'),
        enableSorting: false,
        cell: (info) => {
          const value = info.getValue();

          return (
            <Account
              address={value}
              avatar
              link={routes.neuron.getLink(value)}
              markCurrentAddress
              // link={'../delegators/' + info.getValue()}
            />
          );
        },
      }),

      columnHelper.accessor('metadata.particle', {
        header: 'teaser',
        id: 'teaser',
        size: 150,
        enableSorting: false,
        cell: (info) => {
          const cid = info.getValue();

          return <CIDResolver cid={cid} />;
        },
      }),

      columnHelper.accessor('metadata.description', {
        header: 'rules',
        id: 'rules',
        enableSorting: false,
        cell: (info) => {
          const cid = info.getValue();

          return <Cid cid={cid}>{trimString(cid, 3, 3)}</Cid>;
        },
      }),
    ];

    if (!rootSubnet) {
      col.push(
        // @ts-ignore
        columnHelper.accessor('max_allowed_validators', {
          header: getText('validator', true),
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.subnetwork_n;
            const b = rowB.original.subnetwork_n;

            return a - b;
          },
          cell: (info) => {
            const max = info.getValue();

            const current = info.row.original.subnetwork_n;

            return <F value={current >= max ? max : current} maxValue={max} />;
          },
        }),
        columnHelper.accessor('max_allowed_uids', {
          header: getText('miner', true),
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.subnetwork_n;
            const b = rowB.original.subnetwork_n;

            return a - b;
          },
          cell: (info) => {
            const max = info.getValue();

            const current = info.row.original.subnetwork_n;

            return <F value={current} maxValue={max} />;
          },
        })

        // columnHelper.accessor('emission_values', {
        //   header: 'Emission block',
        //   sortingFn: (rowA, rowB) => {
        //     const a = rowA.original.emission_values;
        //     const b = rowB.original.emission_values;

        //     return a - b;
        //   },

        //   cell: (info) =>
        //     `${parseFloat(
        //       ((info.getValue() / BLOCK_REWARD) * 100).toFixed(2)
        //     )}%`,
        // }),
        // columnHelper.accessor('netuid', {
        //   header: 'link',
        //   cell: (info) => <Link to={'./' + info.getValue()}>link</Link>,
        // }),

        //   columnHelper.accessor('tempo', {
        //     header: 'tempo',
        //     cell: (info) => info.getValue(),
        //   })
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

      if (myAddressJoinedRootSubnet) {
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
    }

    return col;
  }, [
    myCurrentSubnetsJoined,
    myAddressJoinedRootSubnet,
    grades?.all?.data,
    rootSubnet,
    selectedContract,
    getText,
  ]);

  return (
    <Table
      onSelect={(row) => {
        const netuid = data[row].netuid;
        navigate(subnetRoutes.subnet.getLink('pussy', contractName, netuid));
      }}
      columns={columns}
      data={data}
      // if 1 - root subnet
      enableSorting={data.length !== 1}
    />
  );
}

export default SubnetsTable;
