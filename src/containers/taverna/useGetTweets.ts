import { useEffect, useMemo, useState } from 'react';
import dateFormat from 'dateformat';
import { useWebsockets } from 'src/websockets/context';
import db from '../../db';
import { getFollows, getTweet } from '../../utils/search/utils';
import { CID_TWEET, CYBER, PATTERN_CYBER } from '../../utils/config';
import { fromBech32 } from '../../utils/utils';
import { useIpfs } from 'src/contexts/ipfs';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';

const getIndexdDb = async (node: AppIPFS | null, cid: string) => {
  let addressResolve = null;
  const dataIndexdDb = await db.table('following').get({ cid });
  if (dataIndexdDb !== undefined) {
    addressResolve = dataIndexdDb.content;
  } else {
    const responseGetContent = await getIPFSContent(node, cid);
    addressResolve = responseGetContent?.textPreview;
    const ipfsContentAddtToInddexdDB = {
      cid,
      content: addressResolve,
    };
    db.table('following').add(ipfsContentAddtToInddexdDB);
  }
  return addressResolve;
};

interface Tweet {
  status: string;
  text: string;
  address: string;
  content: boolean;
  time: string;
  rank: null | number;
}

type TweetTemp = {
  [key: string]: Tweet;
};

const useGetTweets = (address) => {
  const [tweets, setTweets] = useState<TweetTemp>({});
  const [tweetData, setTweetData] = useState([]);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const [addressFollowData, setAddressFollowData] = useState({});
  const { cyber } = useWebsockets();
  const { node } = useIpfs();

  const addressActive = useMemo(() => {
    return {
      bech32: address,
    };
  }, [address]);

  useEffect(() => {
    if (!cyber?.connected) {
      return;
    }

    const param = {
      query:
        `tm.event='Tx' AND message.action='link' AND cyberlink.objectFrom='${CID_TWEET}'`,
    };

    if (cyber.subscriptions.includes(JSON.stringify(param))) {
      return;
    }

    cyber.sendMessage({
      jsonrpc: '2.0',
      method: 'subscribe',
      id: '0',
      params: param,
    });
  }, [cyber, cyber?.connected]);

  useEffect(() => {
    if (!cyber?.message?.result) {
      return;
    }

    const { message } = cyber;

    if (Object.keys(message.result).length > 0) {
      updateWs(message.result.events);
    }
  }, [cyber, cyber?.message]);

  // useEffect(() => {
  //   const { account } = defaultAccount;
  //   let addressPocket = null;
  //   if (
  //     account !== null &&
  //     Object.prototype.hasOwnProperty.call(account, 'cyber')
  //   ) {
  //     const { keys, bech32 } = account.cyber;
  //     addressPocket = {
  //       bech32,
  //       keys,
  //     };
  //   }
  //   setLoadingTweets(true);
  //   setTweets({});
  //   setTweetData([]);
  //   setAddressFollowData({});
  //   setAddressActive(addressPocket);
  // }, [defaultAccount.name]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTweets(true);
      let responseFollows = null;
      if (addressActive && addressActive.bech32?.match(PATTERN_CYBER)) {
        responseFollows = await getFollows(addressActive.bech32);
        if (responseFollows !== null && responseFollows.total_count > 0) {
          getFollow(responseFollows);
        }
      }
      if (
        !addressActive ||
        !responseFollows ||
        Number(responseFollows.total_count) === 0
      ) {
        const cyberCongressAdsress = fromBech32(
          CYBER.CYBER_CONGRESS_ADDRESS,
          CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
        );

        const responseTwit = await getTweet(cyberCongressAdsress);
        if (responseTwit && responseTwit.total_count > 0) {
          setTweetData((item) => [...item, ...responseTwit.txs]);
        }
      }
      setLoadingTweets(false);
    };

    fetchData();
  }, [addressActive]);

  useEffect(() => {
    let tweetTemp = {};
    if (Object.keys(tweetData).length > 0) {
      tweetTemp = tweetData.reduce(
        (obj, item) => ({
          ...obj,
          [item.tx.value.msg[0].value.links[0].to]: {
            status: 'impossibleLoad',
            text: item.tx.value.msg[0].value.links[0].to,
            address: item.tx.value.msg[0].value.address,
            content: false,
            time: item.timestamp,
            rank: null,
          },
        }),
        {}
      );
      setTweets(tweetTemp as TweetTemp);
      setLoadingTweets(false);
    }
  }, [tweetData]);

  const getFollow = async (responseFollows) => {
    responseFollows.txs.forEach(async (item) => {
      let addressResolve = null;
      const cid = item.tx.value.msg[0].value.links[0].to;
      const response = await getIndexdDb(node, cid);
      addressResolve = response;
      if (addressResolve && addressResolve !== null) {
        let addressFollow = null;
        addressFollow = addressResolve;

        if (addressFollow.match(PATTERN_CYBER)) {
          setAddressFollowData((itemState) => ({
            ...itemState,
            [addressFollow]: cid,
          }));

          const responseTweet = await getTweet(addressFollow);
          if (
            responseTweet &&
            responseTweet.txs &&
            responseTweet.txs.length > 0
          ) {
            setTweetData((items) => [...items, ...responseTweet.txs]);
          }
        }
      }
    });

    setLoadingTweets(false);
  };

  const updateWs = async (data) => {
    const subject = data['cybermeta.subject']?.[0];
    const objectTo = data['cyberlink.objectTo']?.[0];
    const d = new Date();
    const timestamp = dateFormat(d, 'isoUtcDateTime');

    // TODO: filter by type
    if (!subject || !objectTo) {
      return;
    }

    if (
      Object.keys(addressFollowData).length > 0 &&
      Object.prototype.hasOwnProperty.call(addressFollowData, subject)
    ) {
      setTweets((item) => ({
        [objectTo]: {
          status: 'impossibleLoad',
          text: objectTo,
          address: subject,
          content: false,
          time: timestamp,
          rank: null,
        },
        ...item,
      }));
    }
  };

  return {
    tweets,
    loadingTweets,
  };
};

export default useGetTweets;
