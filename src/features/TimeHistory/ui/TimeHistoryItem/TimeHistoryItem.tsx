import { CreatedAt } from 'src/components';
import styles from './TimeHistoryItem.module.scss';
import RouteItem from '../RouteItem/RouteItem';
import { ActionType } from '../type';

type Props = {
  time: string;
  action: {
    type: ActionType;
    value: any;
  };
};

function TimeHistoryItem({ time, action }: Props) {
  let actionValue;

  if (action.type === 'route') {
    actionValue = <RouteItem value={action.value} />;
  }

  return (
    <div className={styles.wrapper}>
      <div>{actionValue}</div>

      <CreatedAt timeAt={time} />
    </div>
  );
}

export default TimeHistoryItem;
