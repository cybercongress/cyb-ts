import useGetGol from './getGolHooks';
import { formatNumber } from '../../utils/utils';
import { ContainerGradientText } from 'src/components';
import Table from 'src/components/Table/Table';
import { useRobotContext } from 'src/pages/robot/Robot';

function TableDiscipline() {
  const { address } = useRobotContext();

  const { resultGol } = useGetGol(address);

  return (
    <ContainerGradientText
      userStyleContent={{
        padding: '15px 0',
        minHeight: '70vh',
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
