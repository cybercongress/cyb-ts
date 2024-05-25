/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link } from 'react-router-dom';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import styles from './WeightsTable.module.scss';
import { Account } from 'src/components';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { useSubnet } from '../../../subnet.context';
import { useMemo } from 'react';
import {
  useCurrentContract,
  useCybernet,
} from 'src/features/cybernet/ui/cybernet.context';

type Props = {};

const columnHelper = createColumnHelper<SubnetNeuron>();

function WeightsTable({}: Props) {
  const address = useCurrentAddress();

  const { subnetQuery, grades, neuronsQuery } = useSubnet();

  const { selectedContract } = useCybernet();

  const uid = subnetQuery.data?.netuid;
  const isRootSubnet = uid === 0;

  const neurons = neuronsQuery.data || [];

  const currentContract = useCurrentContract();

  const subnetsQuery = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  if (!neurons.length) {
    return null;
  }

  const columns = isRootSubnet
    ? subnetsQuery.data
        ?.map((subnet) => subnet.netuid)
        .filter((subnet) => subnet !== 0)
    : neurons.map((neuron) => neuron.uid);

  const data = grades.all.data;

  if (!columns?.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <Table
          enableSorting={false}
          data={neurons}
          columns={[
            // @ts-ignore
            columnHelper.accessor('hotkey', {
              id: 'uid',
              header: '',
              cell: (info) => {
                const uid = info.getValue();

                console.log(currentContract);

                return (
                  <Account
                    address={uid}
                    avatar
                    markCurrentAddress
                    link={cybernetRoutes.delegator.getLink(
                      currentContract.network,
                      currentContract.contractName,
                      uid
                    )}
                  />
                );
              },
            }),
          ]}
        />

        <Table
          enableSorting={false}
          columns={
            // useMemo(
            // () =>
            columns.map((uid) => {
              return columnHelper.accessor(String(uid), {
                id: `t${uid}`,
                header: () => {
                  if (isRootSubnet) {
                    const {
                      metadata: { name },
                    } = selectedContract;
                    return (
                      <Link
                        to={cybernetRoutes.subnet.getLink('pussy', name, uid)}
                      >
                        {name}
                      </Link>
                    );
                  }

                  const hotkey = neurons[uid].hotkey;

                  return (
                    <div
                      style={{
                        position: 'relative',
                      }}
                    >
                      {address === hotkey && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 15,
                            left: 20,
                          }}
                        >
                          🔑
                        </span>
                      )}
                      <Account
                        address={hotkey}
                        avatar
                        // markCurrentAddress
                        onlyAvatar
                        link={cybernetRoutes.delegator.getLink(
                          currentContract.network,
                          currentContract.contractName,
                          hotkey
                        )}
                      />
                    </div>
                  );
                },
                cell: (info) => {
                  const val = info.row.original[uid];

                  if (!val) {
                    return '-';
                  }

                  let color;

                  if (val < 3) {
                    color = 'red';
                  } else if (val < 6) {
                    color = 'orange';
                  } else {
                    color = 'green';
                  }

                  return <div className={styles[`color_${color}`]}>{val}</div>;
                },
              });
            })
            // [columns, address, isRootSubnet]
            // )
          }
          data={data}
        />
      </div>
    </div>
  );
}

export default WeightsTable;
