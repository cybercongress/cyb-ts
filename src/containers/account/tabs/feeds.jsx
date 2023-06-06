import { useEffect, useState } from 'react';
import { NoItems, SearchSnippet } from '../../../components';
import { getTweet } from 'src/utils/search/utils';
import { ContainerGradientText } from 'src/components/containerGradient/ContainerGradient';
import { useRobotContext } from 'src/pages/robot/Robot';

function FeedsTab({ mobile }) {
  const { address } = useRobotContext();

  const [dataTweet, setDataTweet] = useState([]);
  const [loaderTweets, setLoaderTweets] = useState(true);

  const data = dataTweet;

  useEffect(() => {
    const getFeeds = async () => {
      let responseTweet = null;
      let dataTweets = [];
      setDataTweet([]);
      setLoaderTweets(true);

      responseTweet = await getTweet(address);
      console.log(`responseTweet`, responseTweet);
      if (responseTweet && responseTweet.txs && responseTweet.total_count > 0) {
        dataTweets = [...dataTweets, ...responseTweet.txs];
      }
      setDataTweet(dataTweets);
      setLoaderTweets(false);
    };
    getFeeds();
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClickRank = () => {};
  if (data && data.length > 0) {
    return (
      <ContainerGradientText>
        <div className="container-contentItem" style={{ width: '100%' }}>
          {data
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
                  mobile={mobile}
                  onClickRank={onClickRank}
                />
              );
            })}
        </div>
      </ContainerGradientText>
    );
  }
  return (
    <div className="container-contentItem">
      <NoItems text="No feeds" />
    </div>
  );
}

export default FeedsTab;
