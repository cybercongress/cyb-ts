import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DISTRIBUTION, DISTRIBUTION_PRIZE } from '../../../utils/config';
import { Dots } from '../../../components';
import { getRewards } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { getGraphQLQuery } from '../../../utils/search/utils';
import { setCommunityPool } from '../../../redux/actions/gol';

const QueryAddress = (subject) =>
  `  query getRelevanceLeaderboard {
        comm_pool(
          where: {
            subject: { _eq: "${subject}" }
          }
        ) {
          cybs
          subject
        }
      }
  `;

const CommunityPool = ({ address, setCommunityPoolProps }) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = DISTRIBUTION_PRIZE['community pool'];

  useEffect(() => {
    if (address && address !== null) {
      const feachData = async () => {
        const responseData = await getGraphQLQuery(
          QueryAddress(address.bech32 || address)
        );
        if (
          responseData &&
          responseData !== null &&
          responseData.comm_pool &&
          Object.keys(responseData.comm_pool).length > 0
        ) {
          const cybAbsolute = responseData.comm_pool[0].cybs;
          setCybWonAbsolute(cybAbsolute);
          const cybPercent = (cybAbsolute / currentPrize) * 100;
          setCybWonPercent(cybPercent);
          setCommunityPoolProps(cybAbsolute, currentPrize);
          setLoading(false);
        } else {
          setCommunityPoolProps(0, currentPrize);
          setLoading(false);
        }
      };
      feachData();
    } else {
      setCommunityPoolProps(0, currentPrize);
      setLoading(false);
    }
  }, [address]);

  return (
    <RowTable
      text={<Link to="/governance">community pool</Link>}
      reward={DISTRIBUTION['community pool']}
      currentPrize={currentPrize}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = (dispatch) => {
  return {
    setCommunityPoolProps: (amount, prize) =>
      dispatch(setCommunityPool(amount, prize)),
  };
};

export default connect(null, mapDispatchprops)(CommunityPool);
