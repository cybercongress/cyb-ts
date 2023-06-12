import { useEffect, useState } from 'react';
import { NoItems, SearchSnippet } from '../../../components';
import { getTweet } from 'src/utils/search/utils';
import { ContainerGradientText } from 'src/components/containerGradient/ContainerGradient';
import { useRobotContext } from 'src/pages/robot/Robot';
import Loader2 from 'src/components/ui/Loader2';

function FeedsTab() {
  const [dataTweet, setDataTweet] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address, addRefetch } = useRobotContext();

  const data = dataTweet;

  useEffect(() => {
    async function getFeeds() {
      let responseTweet = null;
      let dataTweets = [];
      setDataTweet([]);
      setLoading(true);

      responseTweet = await getTweet(address);
      if (responseTweet && responseTweet.txs && responseTweet.total_count > 0) {
        dataTweets = [...dataTweets, ...responseTweet.txs];
      }
      setDataTweet(dataTweets);
      setLoading(false);
    }
    getFeeds();

    addRefetch(getFeeds);
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClickRank = () => {};

  return (
    <ContainerGradientText>
      <div className="container-contentItem" style={{ width: '100%' }}>
        {loading ? (
          <Loader2 />
        ) : data.length > 0 ? (
          data
            .sort((a, b) => {
              const x = Date.parse(a.timestamp);
              const y = Date.parse(b.timestamp);
              return y - x;
            })
            .map((item, i) => {
              const cid = item.tx.value.msg[0].value.links[0].to;
              return (
                <SearchSnippet
                  key={i}
                  cid={cid}
                  data={item}
                  onClickRank={onClickRank}
                />
              );
            })
        ) : (
          <NoItems text="No feeds" />
        )}
      </div>
    </ContainerGradientText>
  );
}

export default FeedsTab;
