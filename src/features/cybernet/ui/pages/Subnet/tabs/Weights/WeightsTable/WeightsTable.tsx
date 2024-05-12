/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link } from 'react-router-dom';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import styles from './WeightsTable.module.scss';
import { Account } from 'src/components';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

type Props = {
  data: any[];
  neurons: SubnetNeuron[];
  maxWeightsLimit: number;
};

const columnHelper = createColumnHelper<SubnetNeuron>();

function WeightsTable({ data, neurons, maxWeightsLimit }: Props) {
  const address = useCurrentAddress();

  // format to percents
  const percentsData = data.map((item) => {
    return item.map((i) =>
      parseFloat(((i[1] / maxWeightsLimit) * 10).toFixed(0))
    );
  });

  return (
    <div>
      <div className={styles.temp}>
        <Table
          data={neurons}
          columns={[
            columnHelper.accessor('hotkey', {
              header: '',
              cell: (info) => {
                const hotkey = info.getValue();

                const uid = neurons.find((n) => n.hotkey === hotkey)?.uid;

                return (
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <Account
                      address={hotkey}
                      avatar
                      markCurrentAddress
                      link={cybernetRoutes.delegator.getLink(hotkey)}
                    />
                  </div>
                );
              },
            }),
          ]}
        />
        <Table
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
          data={percentsData}
        />
      </div>
    </div>
  );
}

export default WeightsTable;
