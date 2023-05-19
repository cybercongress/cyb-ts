import styles from './Table.module.scss';

type Row = string[];

export type Props = {
  columns: string[];
  data: Row[];
};

function Table({ columns, data }: Props) {
  return (
    <table className={styles.table}>
      <thead>
        {columns.map((column) => (
          <th key={column}>{column}</th>
        ))}
      </thead>

      <tbody>
        {data.map((row, i) => {
          return (
            <tr key={i}>
              {row.map((cell) => {
                return <td key={cell}>{cell}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
