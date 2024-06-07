import {
  useReactTable,
  Column,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  InitialTableState,
} from '@tanstack/react-table';

import styles from './Table.module.scss';
import Loader2 from '../ui/Loader2';
import NoItems from '../ui/noItems';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import Triangle from '../atoms/Triangle/Triangle';

export type Props<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onSelect?: (id: string | null) => void;
  style?: any;

  initialState?: InitialTableState;

  // maybe temporary
  enableSorting?: boolean;
};

function Table<T extends object>({
  columns,
  data,
  isLoading,
  style,
  onSelect,
  initialState,
  enableSorting = true,
}: Props<T>) {
  const [selected, setSelected] = useState<string | null>(null);

  const table = useReactTable({
    // debugTable: true,
    columns,
    data,
    state: {
      rowSelection: {},
    },
    initialState,
    enableSorting,
    // enableRowSelection: true,
    // onRowSelectionChange: (state) => {
    //   console.log(state);
    //   debugger;
    // },

    // enableColumnResizing: true,
    // columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <table
        className={cx(styles.table, {
          [styles.selectable]: !!onSelect,
        })}
        style={style}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={cx({
                      [styles.sortable]: header.column.getCanSort(),
                    })}
                    colSpan={header.colSpan}
                    style={{
                      width: header.column.getSize(),
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    &nbsp;
                    {header.column.getCanSort() && (
                      <Triangle
                        disabled={!header.column.getIsSorted()}
                        direction={
                          header.column.getIsSorted() === 'desc' ? 'down' : 'up'
                        }
                      />
                    )}
                    {/* <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `${styles.resizer} ${
                          header.column.getIsResizing() ? styles.isResizing : ''
                        }`,
                      }}
                    /> */}
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

                  if (
                    ['a', 'button', 'input'].includes(
                      (e.target as any).tagName.toLowerCase()
                    )
                  ) {
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
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
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
