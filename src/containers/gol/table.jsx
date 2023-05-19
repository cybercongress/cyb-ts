import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import RowTable from './components/row';
import useGetGol from './getGolHooks';
import { formatNumber } from '../../utils/utils';
import { ContainerGradientText, NoItems } from 'src/components';
import useGetAddressTemp from '../account/hooks/useGetAddressTemp';

function TableDiscipline() {
  const address = useGetAddressTemp();

  const { resultGol } = useGetGol(address);

  return (
    <ContainerGradientText>
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
            paddingBottom: '15px',
            height: 'auto',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="16px" color="#fff">
              Discipline
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              TOCYB
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              BOOT
            </Text>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {Object.keys(resultGol).length > 0 ? (
            Object.keys(resultGol).map((key) => (
              <RowTable
                text={key}
                key={key}
                cybWon={formatNumber(Math.floor(resultGol[key]))}
              />
            ))
          ) : (
            <NoItems text="No badges" />
          )}
        </Table.Body>
      </Table>
    </ContainerGradientText>
  );
}

export default TableDiscipline;
