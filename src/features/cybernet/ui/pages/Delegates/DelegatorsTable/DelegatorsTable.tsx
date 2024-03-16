import React, { useMemo } from 'react';
import { SubnetInfo } from '../../types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import { Link, useNavigate } from 'react-router-dom';
import { Delegator } from 'src/features/cybernet/types';
import { routes } from 'src/routes';

type Props = {
  data: Delegator[];
};

const columnHelper = createColumnHelper<any>();

function DelegatorsTable({ data }: Props) {
  const navigate = useNavigate();
  return (
    <div>
      <Table
        // onSelect={(row) => navigate(`/delegators/${row}`)}
        columns={useMemo(
          () => [
            columnHelper.accessor('delegate', {
              header: 'delegate',
              cell: (info) => (
                <Link to={'../delegators/' + info.getValue()}>
                  {info.getValue()}
                </Link>
              ),
            }),

            columnHelper.accessor('registrations', {
              header: 'Subnets',
              cell: (info) => (
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                  }}
                >
                  <>
                    {info.getValue().map((val) => {
                      return <Link to={'../subnets/' + val}>{val}</Link>;
                    })}
                  </>
                </div>
              ),
            }),
          ],
          []
        )}
        data={data}
      />
    </div>
  );
}

export default DelegatorsTable;
