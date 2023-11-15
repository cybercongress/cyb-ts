import Tooltip from 'src/components/tooltip/tooltip';

import useGetCreator from 'src/containers/ipfs/hooks/useGetCreator';
import dateFormat from 'dateformat';
import Account from 'src/components/account/account';
import { timeSince } from 'src/utils/utils';
import styles from './Creator.module.scss';

function Creator({ cid }: { cid: string }) {
  const { creator } = useGetCreator(cid);

  if (!creator) {
    return null;
  }

  return (
    <>
      <Tooltip
        placement="bottom"
        tooltip={dateFormat(new Date(creator.timestamp), 'dd/mm/yyyy, HH:MM')}
      >
        <span className={styles.date}>
          {timeSince(Date.now() - Date.parse(creator.timestamp))} ago
        </span>
      </Tooltip>

      <Account address={creator.address} avatar />
    </>
  );
}

export default Creator;
