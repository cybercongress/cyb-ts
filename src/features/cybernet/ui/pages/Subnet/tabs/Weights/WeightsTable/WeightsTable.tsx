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

type Props = {};

const columnHelper = createColumnHelper<SubnetNeuron>();

function WeightsTable({}: Props) {
  const address = useCurrentAddress();

  const { subnetQuery, grades, neuronsQuery } = useSubnet();

  const uid = subnetQuery.data?.netuid;
  const isRootSubnet = uid === 0;

  const neurons = neuronsQuery.data || [];

  const subnetsQuery = useQueryCybernetContract<SubnetInfo[]>({
    query: {
      get_subnets_info: {},
    },
  });

  if (!neurons.length) {
    return null;
  }

  const rows = isRootSubnet
    ? subnetsQuery.data?.map((subnet) => subnet.netuid)
    : neurons.map((neuron) => neuron.hotkey);

  console.log(rows);

  if (!rows?.length) {
    return null;
  }

  console.log(rows);

  const data = grades.all.data;

  return (
    <div>
      <div className={styles.temp}>
        <Table
          enableSorting={false}
          data={rows}
          columns={[
            // @ts-ignore
            columnHelper.accessor(
              (row) => {
                return row;
              },
              {
                id: 'uid',
                header: '',
                cell: (info) => {
                  const uid = info.getValue();

                  if (isRootSubnet) {
                    return (
                      <Link to={cybernetRoutes.subnet.getLink(uid)}>
                        SN {uid}
                      </Link>
                    );
                  }

                  console.log(uid, 'uid');

                  return (
                    <Account
                      address={uid}
                      avatar
                      markCurrentAddress
                      link={cybernetRoutes.delegator.getLink(uid)}
                    />
                  );
                },
              }
            ),
          ]}
        />

        <Table
          enableSorting={false}
          columns={
            // useMemo(
            // () =>
            data.map((_, i) => {
              const { hotkey, uid } = neurons[i];
              return columnHelper.accessor(String(i), {
                header: (
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    {address === hotkey && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -21,
                          left: 5,
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
                      link={cybernetRoutes.delegator.getLink(hotkey)}
                    />
                  </div>
                ),
                cell: (info) => {
                  const val = info.getValue();

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
          }
          data={data}
        />
      </div>
    </div>
  );
}

export default WeightsTable;
