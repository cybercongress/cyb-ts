import React, { useMemo } from 'react';
import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';
import { Account } from 'src/components';

type Props = {
  data: SubnetInfo[];
};

const columnHelper = createColumnHelper<any>();

function WeightsTable({ data }: Props) {
  const navigate = useNavigate();

  const d = data.map((item, i) => {
    const summ = data[i].reduce((acc, item) => acc + item, 0);

    return data[i].map((item) => (item / summ) * 100);
  });

  if (!d.length) {
    return;
  }

  return (
    <div>
      <Table
        // onSelect={(row) => navigate(`./subnets/${row}`)}
        columns={
          // useMemo(
          // () =>
          new Array(d[0].length).fill(null).map((_, i) => {
            return columnHelper.accessor(String(i), {
              header: String(i),
              cell: (info) => {
                const val = info.getValue();

                if (!val) {
                  return '-';
                }
                return val.toFixed(2) + '%';
                // return (val / summ) * 100;
              },
            });
          })
        }
        data={d}
      />
    </div>
  );
}

export default WeightsTable;
