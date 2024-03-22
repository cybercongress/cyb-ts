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

  return (
    <div>
      <Table
        // onSelect={(row) => navigate(`./subnets/${row}`)}
        columns={
          // useMemo(
          // () =>
          new Array(data[0].length).fill(null).map((_, i) => {
            return columnHelper.accessor(String(i), {
              header: String(i),
              cell: (info) => info.getValue(),
            });
          })

          // })),

          // []
        }
        data={data}
      />
    </div>
  );
}

export default WeightsTable;
