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

export type Props<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onSelect?: (id: number) => void;
};

function Table<T extends object>({
  columns,
  data,
  isLoading,
  onSelect,
}: Props<T>) {
  const table = useReactTable({
    columns,
    data,
    state: {
      rowSelection: {},
    },
    debugTable: true,
    enableRowSelection: true,
    onRowSelectionChange: (state) => {
      console.log(state);
      debugger;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className={styles.table}>
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
                // style={{
                //   color: row.getIsSelected() ? 'red' : 'black',
                // }}
                // onClick={(e) => {
                //   // TODO: move to tbody
                //   const id = Number(e.currentTarget.getAttribute('data-id'));
                //   onSelect?.(id);
                // }}
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
