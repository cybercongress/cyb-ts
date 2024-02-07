import Table from 'src/components/Table/Table';
import { useRobotContext } from 'src/pages/robot/robot.context';
import Display from 'src/components/containerGradient/Display/Display';
import { formatNumber } from '../../utils/utils';
import useGetGol from './getGolHooks';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';

function TableDiscipline() {
  const { address } = useRobotContext();

  const { resultGol } = useGetGol(address);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        something really special and rare <br />
        it ain't for sale, but you can hustle to earn it
      </>
    );
  }, [setAdviser]);

  return (
    <Display noPaddingX>
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
    </Display>
  );
}

export default TableDiscipline;
