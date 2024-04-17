import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link } from 'react-router-dom';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import styles from './WeightsTable.module.scss';

type Props = {
  data: any[];
  neurons: SubnetNeuron[];
  maxWeightsLimit: number;
};

const columnHelper = createColumnHelper<any>();

function WeightsTable({ data, neurons, maxWeightsLimit }: Props) {
  // const navigate = useNavigate();

  // format to percents
  const percentsData = data.map((item) => {
    return item.map((i) =>
      parseFloat(((i[1] / maxWeightsLimit) * 100).toFixed(2))
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
                  <Link to={cybernetRoutes.delegator.getLink(hotkey)}>
                    {uid}
                  </Link>
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
                  <Link to={cybernetRoutes.delegator.getLink(hotkey)}>
                    {uid}
                  </Link>
                ),
                cell: (info) => {
                  const val = info.getValue();

                  if (!val) {
                    return '-';
                  }
                  return val + '%';
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
