import { useMemo } from 'react';
import Table from 'src/components/Table/Table';
import { ValidatorTableData } from '../../types/tableData';
import renderColumnsData from './map';

function ValidatorTable({
  data,
  onSelect,
}: {
  data: ValidatorTableData[];
  onSelect: (row?: ValidatorTableData) => void;
}) {
  const columns = useMemo(() => renderColumnsData(), []);

  // console.log('data', data);

  return (
    <Table
      data={data}
      columns={columns}
      onSelect={(row) => {
        onSelect(row ? data[Number(row)] : undefined);
      }}
    />
  );
}

export default ValidatorTable;
