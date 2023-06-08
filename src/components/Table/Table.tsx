import {
  useReactTable,
  Column,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import styles from './Table.module.scss';
import Loader2 from '../ui/Loader2';
import NoItems from '../ui/noItems';
import { useEffect, useState } from 'react';
import cx from 'classnames';

export type Props<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onSelect?: (id: string | null) => void;
  style: any;
};

function Table<T extends object>({
  columns,
  data,
  isLoading,
  style,
  onSelect,
}: Props<T>) {
  const [selected, setSelected] = useState<string | null>(null);

  const table = useReactTable({
    columns,
    data,
    state: {
      rowSelection: {},
    },
    // debugTable: true,
    enableRowSelection: true,
    onRowSelectionChange: (state) => {
      console.log(state);
      debugger;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className={styles.table} style={style}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                data-id={row.id}
                className={cx({ [styles.rowSelected]: row.id === selected })}
                onClick={(e) => {
                  // TODO: move to tbody

                  if (!onSelect) {
                    return;
                  }

                  const id = e.currentTarget.getAttribute('data-id');

                  if (id === selected) {
                    setSelected(null);
                    onSelect(null);
                    return;
                  }

                  setSelected(id);
                  onSelect(id);
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {isLoading ? <Loader2 /> : !data.length && <NoItems text="No data" />}
    </>
  );
}

export default Table;
