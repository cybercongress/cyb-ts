import React, { useMemo } from 'react';
import { SubnetInfo } from '../../../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';
import { Account, Cid } from 'src/components';
import NProvider from './NProvider/NProvider';
import { BLOCK_REWARD } from 'src/features/cybernet/constants';
import useDelegate from '../../../hooks/useDelegate';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

type Props = {
  data: SubnetInfo[];
};

const columnHelper = createColumnHelper<any>();

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

  const { data: d2 } = useDelegate(address);
  const myCurrentSubnetsJoined = d2?.registrations;

  return (
    <div>
      <Table
        // onSelect={(row) => navigate(`./subnets/${row}`)}
        columns={useMemo(
          () => [
            columnHelper.accessor('netuid', {
              header: '№',
              cell: (info) => {
                const netuid = info.getValue();

                const isMySubnet = myCurrentSubnetsJoined?.includes(netuid);

                return (
                  <Link to={'./' + netuid}>
                    {netuid} {isMySubnet && '✅'}
                  </Link>
                );
              },
            }),
            columnHelper.accessor('max_allowed_validators', {
              header: 'leaders',
              cell: (info) => {
                const n = info.getValue();

                const current = info.row.original.subnetwork_n;

                return <F value={current} maxValue={n} />;
              },
            }),
            columnHelper.accessor('max_allowed_uids', {
              header: 'creators',
              cell: (info) => {
                const n = info.getValue();

                const current = info.row.original.subnetwork_n;

                return <F value={current} maxValue={n} />;
              },
            }),

            columnHelper.accessor('owner', {
              header: 'owner',
              cell: (info) => (
                <Link to={routes.neuron.getLink(info.getValue())}>
                  {/* // <Link to={'../delegators/' + info.getValue()}> */}
                  {/* <NProvider address={info.getValue()} /> */}
                  <Account address={info.getValue()} />
                  {/* {info.getValue().substr(0, 10) + '...'} */}
                </Link>
              ),
            }),

            columnHelper.accessor('emission_values', {
              header: 'Emission block',
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
            }),

            columnHelper.accessor('metadata', {
              header: 'metadata',
              cell: (info) => {
                const cid = info.getValue();

                return (
                  <Cid cid={info.getValue()}>
                    {`${cid.substr(0, 6)}...${cid.substr(-6)}`}
                  </Cid>
                );
              },
            }),
          ],
          [myCurrentSubnetsJoined]
        )}
        data={data}
      />
    </div>
  );
}

export default SubnetsTable;
