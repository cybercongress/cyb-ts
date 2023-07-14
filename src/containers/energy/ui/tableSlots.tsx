import { useIbcDenom } from 'src/contexts/ibcDenom';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import { TextTable, ValueImg } from '../../../components';
import { CYBER } from '../../../utils/config';
import Table from 'src/components/Table/Table';
import { CssVariables } from 'src/style/variables';
import { createColumnHelper } from '@tanstack/react-table';

function TableSlots({ data }) {
  const { traseDenom } = useIbcDenom();
  const [{ coinDecimals: coinDecimalsA }] = traseDenom('milliampere');
  const [{ coinDecimals: coinDecimalsV }] = traseDenom('millivolt');

  const d = data?.map((item) => {
    return {
      state:
        item.status === 'Unfreezing' ? (
          <TextTable color={CssVariables.PRIMARY_COLOR}>Unfreezing</TextTable>
        ) : (
          <TextTable marginRight={5} color="#ff9100">
            Liquid
          </TextTable>
        ),
      unfreezing: item.time ? <TextTable>{item.time}</TextTable> : '',
      supplied: item.amount[CYBER.DENOM_LIQUID_TOKEN] ? (
        <TextTable>
          {formatNumber(item.amount[CYBER.DENOM_LIQUID_TOKEN])}
          <ValueImg text={CYBER.DENOM_LIQUID_TOKEN} onlyImg />
        </TextTable>
      ) : (
        ''
      ),
      received: (
        <>
          {item.amount.millivolt && (
            <TextTable>
              {getDisplayAmount(item.amount.millivolt, coinDecimalsV)}
              <ValueImg text="millivolt" onlyImg />
            </TextTable>
          )}
          {item.amount.milliampere && (
            <TextTable>
              {getDisplayAmount(item.amount.milliampere, coinDecimalsA)}
              <ValueImg text="milliampere" onlyImg />
            </TextTable>
          )}
        </>
      ),
    };
  });

  const columnHelper = createColumnHelper<any>();

  return (
    <Table
      columns={[
        columnHelper.accessor('state', {
          header: 'State',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('unfreezing', {
          header: 'Unfreezing',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('supplied', {
          header: 'Supplied',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('received', {
          header: 'Received',
          cell: (info) => info.getValue(),
        }),
      ]}
      data={d}
    />
  );
}

export default TableSlots;
