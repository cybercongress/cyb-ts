import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  DISTRIBUTION,
  DISTRIBUTION_PRIZE,
  TAKEOFF,
} from '../../../utils/config';
import { Dots } from '../../../components';
import { getLifetime } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolLifeTime } from '../../../redux/actions/gol';

const Lifetime = ({
  takeoffDonations = 0,
  dataQ,
  setGolLifeTimeProps,
  lifetime,
}) => {
  const [loading, setLoading] = useState(true);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = DISTRIBUTION_PRIZE.lifetime;

  useEffect(() => {
    if (dataQ !== null) {
      const fetchData = async () => {
        console.log(dataQ);
        const data = await getLifetime({
          block: dataQ.pre_commit_view_aggregate.aggregate.sum.precommits,
          preCommit: dataQ.pre_commit_view[0].precommits,
        });
        const cybAbsolute = data * currentPrize;
        setGolLifeTimeProps(Math.floor(cybAbsolute), currentPrize);
        if (cybAbsolute !== 0) {
          const cybPercent = (cybAbsolute / currentPrize) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setGolLifeTimeProps(0, currentPrize);
      setLoading(false);
    }
  }, [takeoffDonations, dataQ]);

  return (
    <RowTable
      text={<Link to="/gol/lifetime">lifetime</Link>}
      reward={DISTRIBUTION.lifetime}
      currentPrize={currentPrize}
      cybWonAbsolute={loading ? <Dots /> : formatNumber(lifetime.cybAbsolute)}
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = (dispatch) => {
  return {
    setGolLifeTimeProps: (amount, prize) =>
      dispatch(setGolLifeTime(amount, prize)),
  };
};

const mapStateToProps = (store) => {
  return {
    lifetime: store.gol.lifetime,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Lifetime);
