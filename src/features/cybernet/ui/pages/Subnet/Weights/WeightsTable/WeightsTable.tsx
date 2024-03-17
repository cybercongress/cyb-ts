import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../routes';
import { cutAddress } from 'src/components/MusicalAddress/utils';

type Props = {
  data: any[];
  neurons: SubnetNeuron[];
};

const columnHelper = createColumnHelper<any>();

function WeightsTable({ data, neurons }: Props) {
  // const navigate = useNavigate();

  // format to percents
  const percentsData = data.map((item, i) => {
    const sum = data[i].reduce((acc, item) => acc + item, 0);

    return data[i].map((item) => (item / sum) * 100);
  });

  return (
    <div>
      <Table
        columns={
          // useMemo(
          // () =>
          data.map((_, i) => {
            const { hotkey } = neurons[i];
            return columnHelper.accessor(String(i), {
              header: (
                <Link to={cybernetRoutes.delegator.getLink(hotkey)}>
                  {hotkey}
                </Link>
              ),
              cell: (info) => {
                const val = info.getValue();

                if (!val) {
                  return '-';
                }
                return val.toFixed(2) + '%';
              },
            });
          })
        }
        data={percentsData}
      />
    </div>
  );
}

export default WeightsTable;
