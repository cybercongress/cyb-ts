import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getRelevance } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const BLOCK_SUBSCRIPTION = gql`
  query newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

const Relevance = ({ addressLedger, reward = 0, won = 0 }) => {
  const { loading, data: dataBlock } = useQuery(BLOCK_SUBSCRIPTION);

  if (loading) {
    return <Dots />;
  }

  return <RelevanceB won={won} dataBlock={dataBlock.block[0].height} />;
};

const RelevanceB = ({ addressLedger, reward = 0, won = 0, dataBlock }) => {
  const GET_CHARACTERS = gql`
  query newBlock {
    relevance_aggregate(where: {height: {_eq: ${dataBlock}}}) {
      aggregate {
        sum {
          rank
        }
      }
    }
    rewards_view(where: {_and: [{block: {_eq: ${dataBlock}}}, {subject: {_eq: "cyber18naxcfp2s397a2ucav2m53f003uylk3qxa6h5r"}}]}) {
      object
      subject
      rank
      order_number
    }
  }
`;
  const { loading, data: dataQ } = useQuery(GET_CHARACTERS);

  if (loading) {
    return <Dots />;
  }

  let arrLink = [];
  dataQ.rewards_view.forEach(item => {
    arrLink.push({
      object: {
        _eq: item.object,
      },
    });
  });

  const object = arrLink;
  const json = JSON.stringify(object);
  const unquoted = json.replace(/"([^"]+)":/g, '$1:');
  arrLink = unquoted;

  return (
    <RelevanceC
      dataBlock={dataBlock}
      dataRelevance={dataQ}
      won={won}
      arrLink={arrLink}
    />
  );
};

const RelevanceC = ({
  addressLedger,
  reward = 0,
  won = 0,
  dataRelevance,
  dataBlock,
  arrLink,
}) => {
  const [loadingCalc, setLoadingCalc] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.relevance
  );
  const GET_LINKAGES = gql`
  query newBlock {
    linkages_view(
      where: {
        _and: [
          { height: { _eq: ${dataBlock} } }
          {
            _or: ${arrLink}
          }
        ]
      }
    ) {
      object
      linkages
    }
  }
`;

  const { loading, data: dataQ } = useQuery(GET_LINKAGES);

  if (loading) {
    return <Dots />;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRelevance(dataRelevance, dataQ);
      console.log(data);
      const cybAbsolute = data * currentPrize;
      setCybWonAbsolute(cybAbsolute);
      if (cybAbsolute !== 0) {
        const cybPercent = (cybAbsolute / currentPrize) * 100;
        setCybWonPercent(cybPercent);
      }
      setLoadingCalc(false);
    };
    fetchData();
  }, [won, addressLedger, dataQ, dataRelevance]);

  return (
    <RowTable
      text="relevance"
      reward={DISTRIBUTION.relevance}
      currentPrize={currentPrize}
      cybWonAbsolute={
        loadingCalc ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={
        loadingCalc ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`
      }
    />
  );
};

export default Relevance;
