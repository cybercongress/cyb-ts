import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  DISTRIBUTION,
  DISTRIBUTION_PRIZE,
  TAKEOFF,
} from '../../../utils/config';
import { Dots } from '../../../components';
import { getRelevance } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolRelevance } from '../../../redux/actions/gol';
import { getGraphQLQuery } from '../../../utils/search/utils';

const QueryAddress = (subject) =>
  `  query getRelevanceLeaderboard {
        relevance_leaderboard(
          where: {
            subject: { _eq: "${subject}" }
          }
        ) {
          subject
          share
        }
      }
  `;

const useRelevaceHook = (address) => {
  const [loading, setLoading] = useState(true);
  const [share, setShare] = useState(0);

  useEffect(() => {
    if (address && address !== null) {
      const feachData = async () => {
        const recponceData = await getGraphQLQuery(
          QueryAddress(address.bech32 || address)
        );
        if (
          recponceData &&
          recponceData !== null &&
          recponceData.relevance_leaderboard &&
          Object.keys(recponceData.relevance_leaderboard).length > 0
        ) {
          const shareData = recponceData.relevance_leaderboard[0].share;
          setShare(shareData);
          setLoading(false);
        } else {
          setLoading(false);
          setShare(0);
        }
      };
      feachData();
    } else {
      setShare(0);
      setLoading(false);
    }
  }, [address]);

  return {
    loading,
    share,
  };
};

const Relevance = ({
  takeoffDonations = 0,
  addressLedger,
  dataBlock,
  arrLink,
  setGolRelevanceProps,
  relevance,
}) => {
  const [loadingCalc, setLoadingCalc] = useState(true);
  const { loading, share } = useRelevaceHook(addressLedger);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const prize = DISTRIBUTION_PRIZE.relevance;

  useEffect(() => {
    if (!loading) {
      const cybAbsolute = share * prize;
      setGolRelevanceProps(Math.floor(cybAbsolute), prize);
      setCybWonAbsolute(Math.floor(cybAbsolute));
      if (cybAbsolute !== 0) {
        const cybPercent = (cybAbsolute / prize) * 100;
        setCybWonPercent(cybPercent);
      }
      setLoadingCalc(false);
    }
  }, [loading, share, prize]);

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

const mapDispatchprops = (dispatch) => {
  return {
    setGolRelevanceProps: (amount, prize) =>
      dispatch(setGolRelevance(amount, prize)),
  };
};

export default connect(null, mapDispatchprops)(Relevance);
