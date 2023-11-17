import s from './RelayerItem.module.scss';

function MessageItem({ text = '' }) {
  return (
    <div className={s.containerMessageItem}>
      <span>{text}</span>
    </div>
  );
}

function LogRelayer({ relayerLog }) {
  return (
    <div className={s.containerLogRelayer}>
      {relayerLog &&
        Object.keys(relayerLog).length > 0 &&
        relayerLog.map((item, i) => <MessageItem text={item} key={i} />)}
    </div>
  );
}

export default LogRelayer;
