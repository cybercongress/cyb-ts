import { useEffect, useMemo } from 'react';
import { ContainerGradientText } from 'src/components/containerGradient/ContainerGradient';
import { useRobotContext } from 'src/pages/robot/robot.context';
import { useAdviser } from 'src/features/adviser/context';
import Loader2 from 'src/components/ui/Loader2';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dots, NoItems, SearchSnippet } from '../../../../../components';
import useGetLog from '../hooks/useGetLog';

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

  const onClickRank = () => {};

  const logRows = useMemo(() => {
    return data.map((item, i) => {
      const cid = item.tx.body.messages[0].links[0].to;
      return (
        <SearchSnippet
          key={i}
          cid={cid}
          data={item}
          onClickRank={onClickRank}
        />
      );
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
      >
        {logRows}
      </InfiniteScroll>
    );
  } else {
    content = <NoItems text="No feeds" />;
  }

  return (
    <ContainerGradientText>
      <div className="container-contentItem" style={{ width: '100%' }}>
        {content}
      </div>
    </ContainerGradientText>
  );
}

export default FeedsTab;
