import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { setGolEuler4Rewards } from '../../../redux/actions/gol';

import { getRewards } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const Rewards = ({
  validatorAddress,
  reward = 0,
  won = 0,
  setGolEuler4RewardsProps,
}) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const [linkTo, setLinkTo] = useState('/gift');
  const currentPrize = '-';

  useEffect(() => {
    if (validatorAddress !== null) {
      setLinkTo(`/gift/${validatorAddress}`);
      const fetchData = async () => {
        const data = await getRewards(validatorAddress);
        const cybAbsolute = data;
        setCybWonAbsolute(cybAbsolute);
        if (cybAbsolute !== 0) {
          setGolEuler4RewardsProps(Math.floor(cybAbsolute));
          const cybPercent =
            (cybAbsolute / DISTRIBUTION['euler 4 rewards']) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [won, validatorAddress]);

  return (
    <RowTable
      text={<Link to={linkTo}>euler 4 rewards</Link>}
      reward={formatNumber(DISTRIBUTION['euler 4 rewards'])}
      currentPrize={formatNumber(currentPrize)}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    setGolEuler4RewardsProps: amount => dispatch(setGolEuler4Rewards(amount)),
  };
};

export default connect(null, mapDispatchprops)(Rewards);
