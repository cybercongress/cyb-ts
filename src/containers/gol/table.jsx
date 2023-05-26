import useGetGol from './getGolHooks';
import { formatNumber } from '../../utils/utils';
import { ContainerGradientText } from 'src/components';
import useGetAddressTemp from '../account/hooks/useGetAddressTemp';
import Table from 'src/components/Table/Table';

function TableDiscipline() {
  const address = useGetAddressTemp();

  const { resultGol } = useGetGol(address);

  return (
    <ContainerGradientText
      userStyleContent={{
        padding: '15px 0',
      }}
    >
      <Table
        columns={[
          {
            header: 'Discipline',
            accessorKey: 'discipline',
          },
          {
            header: 'TOCYB',
            accessorKey: 'tocyb',
          },
          {
            header: 'BOOT',
            accessorKey: 'boot',
          },
        ]}
        data={Object.keys(resultGol).map((key) => {
          return {
            discipline: key,
            tocyb: formatNumber(Math.floor(resultGol[key])),
          };
        })}
      />
    </ContainerGradientText>
  );
}

export default TableDiscipline;
