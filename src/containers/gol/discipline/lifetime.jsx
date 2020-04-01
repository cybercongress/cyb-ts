import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getLifetime } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolLifeTime } from '../../../redux/actions/gol';

const Lifetime = ({ won = 0, dataQ, setGolLifeTimeProps }) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
  );

  useEffect(() => {
    if (dataQ !== null) {
      const fetchData = async () => {
        console.log(dataQ);
        const data = await getLifetime({
          block: dataQ.pre_commit_aggregate.aggregate.count,
          preCommit: dataQ.pre_commit_view[0].precommits,
        });
        const cybAbsolute = data * currentPrize;
        setCybWonAbsolute(cybAbsolute);
        if (cybAbsolute !== 0) {
          setGolLifeTimeProps(Math.floor(cybAbsolute));
          const cybPercent = (cybAbsolute / currentPrize) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [won, dataQ]);

  return (
    <RowTable
      text={<Link to="/gol/lifetime">lifetime</Link>}
      reward={DISTRIBUTION.lifetime}
      currentPrize={currentPrize}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    setGolLifeTimeProps: amount => dispatch(setGolLifeTime(amount)),
  };
};

export default connect(null, mapDispatchprops)(Lifetime);
