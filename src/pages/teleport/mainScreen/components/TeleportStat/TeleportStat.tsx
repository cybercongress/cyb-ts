import Txs from 'src/containers/brain/tx';
import AccountCount from 'src/containers/brain/accountCount';
import s from './TeleportStat.module.scss';

function Value({ children }: { children: React.ReactNode }) {
  return <span className={s.value}>{children}</span>;
}

function TeleportStat() {
  return (
    <span className={s.container}>
      <Value>
        <Txs />
      </Value>
      transactions submitted <br />
      by
      <Value>
        <AccountCount />
      </Value>
      neurons
    </span>
  );
}

export default TeleportStat;
