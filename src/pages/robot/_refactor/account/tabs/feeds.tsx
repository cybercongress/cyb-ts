import { useEffect, useMemo } from 'react';
import { useRobotContext } from 'src/pages/robot/robot.context';
import { useAdviser } from 'src/features/adviser/context';
import Loader2 from 'src/components/ui/Loader2';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spark from 'src/components/search/Spark/Spark';
import { RegistryTypes } from 'src/services/soft.js/types';
import { Display, NoItems } from '../../../../../components';
import useGetLog from '../hooks/useGetLog';
import styles from './feeds.module.scss';

function FeedsTab() {
  const { address, addRefetch } = useRobotContext();
  const { setAdviser } = useAdviser();
  const { data, fetchNextPage, hasNextPage, refetch, error, isInitialLoading } =
    useGetLog(address);

  useEffect(() => {
    if (error) {
      setAdviser(error.message, 'red');
    } else {
      setAdviser(
        <>
          free unlimited public feed made by neuron <br />
          we accepting all type of content
        </>
      );
    }

    return () => {
      // maybe remove
      setAdviser(null);
    };
  }, [setAdviser, error]);

  const logRows = useMemo(() => {
    return data.map((item, i) => {
      // add txs types
      let cyberLinkMessage = item.tx.body.messages[0];

      if (!cyberLinkMessage) {
        return null;
      }

      if (cyberLinkMessage['@type'] === RegistryTypes.MsgExec) {
        [cyberLinkMessage] = cyberLinkMessage.msgs;
      }

      const cid = cyberLinkMessage.links[0].to;

      if (!cid) {
        return null;
      }

      return <Spark selfLinks key={i} cid={cid} itemData={item} query="log" />;
    });
  }, [data]);

  useEffect(() => {
    addRefetch(refetch);
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let content;

  if (isInitialLoading) {
    content = <Loader2 />;
  } else if (error) {
    content = null;
  } else if (data.length) {
    content = (
      <InfiniteScroll
        dataLength={Object.keys(logRows).length}
        hasMore={Boolean(hasNextPage)}
        next={fetchNextPage}
        loader={<Loader2 />}
        className={styles.containerLogRows}
      >
        {logRows}
      </InfiniteScroll>
    );
  } else {
    content = <NoItems text="No feeds" />;
  }

  return <Display>{content}</Display>;
}

export default FeedsTab;
