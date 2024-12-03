import { useMemo } from 'react';
import Table from 'src/components/Table/Table';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import { ValidatorTableData } from '../../../../../types/tableData';
import renderColumnsData from './map';
import TransitionContainer from './ui/TransitionContainer/TransitionContainer';

function TableGroup({
  data,
  columns,
  onSelect,
}: {
  data: { [key: string]: ValidatorTableData[] };
  columns: [];
  onSelect: (row?: ValidatorTableData) => void;
}) {
  return (
    <>
      {Object.keys(data).map((key) => {
        const itemData = data[key];
        const bondAmount = itemData.reduce(
          (acc, item) => {
            const amount = new BigNumber(acc.amount)
              .plus(item.delegation?.amount || 0)
              .toNumber();

            acc.amount = amount;
            if (item.delegation) {
              acc.denom = item.delegation.denom;
            }
            return acc;
          },
          { amount: 0, denom: '' }
        );

        return (
          <TransitionContainer
            key={key}
            title={key}
            isOpenState={!(key === 'inactive' || key === 'relax')}
            titleOptions={
              bondAmount.denom.length ? (
                <IconsNumber
                  value={bondAmount.amount}
                  type={bondAmount.denom}
                />
              ) : undefined
            }
          >
            <Table
              data={itemData}
              columns={columns}
              enableSorting={!(itemData.length === 1)}
              onSelect={(row) => {
                onSelect(row ? itemData[Number(row)] : undefined);
              }}
            />
          </TransitionContainer>
        );
      })}
    </>
  );
}

function ValidatorTable({
  data,
  onSelect,
}: {
  data: ValidatorTableData[];
  onSelect: (row?: ValidatorTableData) => void;
}) {
  const columns = useMemo(() => renderColumnsData(), []);

  const dataGroup = useMemo(() => {
    return _.groupBy(data, (item) => item.rank);
  }, [data]);

  return <TableGroup data={dataGroup} columns={columns} onSelect={onSelect} />;

  // return (
  //   <Table
  //     data={data}
  //     columns={columns}
  //     onSelect={(row) => {
  //       onSelect(row ? data[Number(row)] : undefined);
  //     }}
  //   />
  // );
}

export default ValidatorTable;
