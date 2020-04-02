import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getRelevance } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolRelevance } from '../../../redux/actions/gol';

const Relevance = ({
  addressLedger,
  reward = 0,
  won = 0,
  setGolRelevanceProps,
  dataBlock,
}) => {
  if (addressLedger === null) {
    return (
      <RelevanceC
        dataBlock={dataBlock}
        dataRelevance={null}
        won={won}
        arrLink={null}
        addressLedger={addressLedger}
        setGolRelevanceProps={setGolRelevanceProps}
      />
    );
  }
  const GET_CHARACTERS = gql`
  query newBlock {
    relevance_aggregate(where: {height: {_eq: ${dataBlock}}}) {
      aggregate {
        sum {
          rank
        }
      }
    }
    rewards_view(where: {_and: [{block: {_eq: ${dataBlock}}}, {subject: {_eq: "${addressLedger.bech32 ||
    addressLedger}"}}]}) {
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
      setGolRelevanceProps={setGolRelevanceProps}
      arrLink={arrLink}
    />
  );
};

const RelevanceC = ({
  won = 0,
  dataRelevance,
  addressLedger,
  dataBlock,
  arrLink,
  setGolRelevanceProps,
  relevance,
}) => {
  const [loadingCalc, setLoadingCalc] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const prize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.relevance
  );

  if (addressLedger === null) {
    useEffect(() => {
      setGolRelevanceProps(0, prize);
    }, [prize]);

    // setLoadingCalc(false);
    return (
      <RowTable
        text={<Link to="/gol/relevance">relevance</Link>}
        reward={DISTRIBUTION.relevance}
        currentPrize={prize}
        cybWonAbsolute={cybWonAbsolute}
        cybWonPercent={`${formatNumber(cybWonPercent, 2)}%`}
      />
    );
  }
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

  const fetchData = async () => {
    const data = await getRelevance(dataRelevance, dataQ);
    console.log(data);
    const cybAbsolute = data * prize;
    setGolRelevanceProps(Math.floor(cybAbsolute), prize);
    setCybWonAbsolute(Math.floor(cybAbsolute));
    if (cybAbsolute !== 0) {
      const cybPercent = (cybAbsolute / prize) * 100;
      setCybWonPercent(cybPercent);
    }
    setLoadingCalc(false);
  };
  fetchData();

  return (
    <RowTable
      text={<Link to="/gol/relevance">relevance</Link>}
      reward={DISTRIBUTION.relevance}
      currentPrize={prize}
      cybWonAbsolute={
        loadingCalc ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={
        loadingCalc ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`
      }
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    setGolRelevanceProps: (amount, prize) =>
      dispatch(setGolRelevance(amount, prize)),
  };
};

export default connect(null, mapDispatchprops)(Relevance);
