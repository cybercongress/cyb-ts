import { useMemo, useState } from 'react';
import _ from 'lodash';
import { Display, Tabs } from 'src/components';
import Table from 'src/components/Table/Table';
import BigNumber from 'bignumber.js';
import { ValidatorTableData } from '../../../../../types/tableData';
import renderColumnsData from './map';
import ValidatorTableByGroup from './ui/ValidatorTableByGroup/ValidatorTableByGroup';

enum TabsKey {
  power = 'power',
  bond = 'bond',
  apr = 'apr',
}

const TabsKeyConfig = {
  [TabsKey.power]: {
    title: 'power',
  },
  [TabsKey.apr]: {
    title: 'apr',
  },
  [TabsKey.bond]: {
    title: 'my heroes',
  },
};

function ValidatorTable({
  data,
  onSelect,
}: {
  data: ValidatorTableData[];
  onSelect: (row?: ValidatorTableData) => void;
}) {
  const [selected, setSelected] = useState<TabsKey>(TabsKey.power);
  const columns = useMemo(() => renderColumnsData(), []);

  const dataBySelected = useMemo(() => {
    if (selected === TabsKey.bond) {
      return data.filter(
        (item) =>
          item.delegation && new BigNumber(item.delegation.amount).comparedTo(0)
      );
    }

    if (selected === TabsKey.apr) {
      return data
        .filter((item) => !item.jailed)
        .sort((itemA, itemB) => itemB.apr - itemA.apr);
    }

    return _.groupBy(data, (item) => item.rank);
  }, [data, selected]);

  return (
    <>
      <Tabs
        selected={selected}
        options={[TabsKey.power, TabsKey.apr, TabsKey.bond].map((type) => {
          return {
            text: TabsKeyConfig[type].title,
            key: type,
            onClick: () => setSelected(type),
          };
        })}
      />
      <Table data={[]} columns={columns} enableSorting={false} hideBody />
      {selected === TabsKey.power ? (
        <ValidatorTableByGroup
          data={dataBySelected}
          columns={columns}
          onSelect={onSelect}
        />
      ) : (
        <Display noPadding>
          <Table
            data={dataBySelected}
            columns={columns}
            hideHeader
            enableSorting={false}
            onSelect={(row) => {
              onSelect(row ? data[Number(row)] : undefined);
            }}
          />
        </Display>
      )}
    </>
  );

  // return (

  // );
}

export default ValidatorTable;
