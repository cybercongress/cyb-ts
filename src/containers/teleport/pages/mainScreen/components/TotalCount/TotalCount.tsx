import styles from './styles.module.scss';

type Props = {
  value: number | string;
  text?: string;
  onlyValue?: boolean;
};

function TotalCount({ onlyValue, value, text }: Props) {
  return (
    <div className={styles.containerTotalCount}>
      <div className={styles.countValue}>+{value}</div>
      {!onlyValue && <span className={styles.countText}>{text}</span>}
    </div>
  );
}

export default TotalCount;
