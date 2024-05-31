import { useHub } from 'src/contexts/hub';
import Table from 'src/components/Table/Table';
import { useMemo } from 'react';
import { entityToDto } from 'src/utils/dto';
import DisplayHub from '../../components/DisplayHub/DisplayHub';
import renderColumnsData from './map';

function Networks() {
  const { networks } = useHub();

  const dataRow = networks
    ? Object.keys(networks).map((key) => entityToDto(networks[key]))
    : [];

  const columnsData = useMemo(() => renderColumnsData(), []);

  return (
    <DisplayHub title="networks" type="HUB_NETWORKS">
      <Table data={dataRow} columns={columnsData} />
    </DisplayHub>
  );
}

export default Networks;
