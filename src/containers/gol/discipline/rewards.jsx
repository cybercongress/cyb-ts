import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots, LinkWindow } from '../../../components';
import { setGolEuler4Rewards } from '../../../redux/actions/gol';

import { getRewards } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const Rewards = ({
  validatorAddress,
  won = 0,
  setGolEuler4RewardsProps,
  euler4Rewards,
}) => {
  const [loading, setLoading] = useState(true);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const [linkTo, setLinkTo] = useState(
    'https://cybercongress.ai/game-of-links/'
  );
  const currentPrize = '-';

  useEffect(() => {
    if (validatorAddress !== null) {
      const fetchData = async () => {
        const data = await getRewards(validatorAddress);
        const cybAbsolute = data;
        if (cybAbsolute !== 0) {
          setGolEuler4RewardsProps(
            Math.floor(cybAbsolute),
            DISTRIBUTION['euler 4 rewards']
          );
          setLinkTo(`/gift/${validatorAddress}`);
          const cybPercent =
            (cybAbsolute / DISTRIBUTION['euler 4 rewards']) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setGolEuler4RewardsProps(0, DISTRIBUTION['euler 4 rewards']);
      setLoading(false);
    }
  }, [won, validatorAddress]);

  return (
    <RowTable
      text={
        linkTo.indexOf('https') !== -1 ? (
          <LinkWindow to={linkTo}>euler 4 rewards</LinkWindow>
        ) : (
          <Link to={linkTo}>euler 4 rewards</Link>
        )
      }
      reward={formatNumber(DISTRIBUTION['euler 4 rewards'])}
      currentPrize={formatNumber(DISTRIBUTION['euler 4 rewards'])}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(euler4Rewards.cybAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    setGolEuler4RewardsProps: (amount, prize) =>
      dispatch(setGolEuler4Rewards(amount, prize)),
  };
};

const mapStateToProps = store => {
  return {
    euler4Rewards: store.gol.euler4Rewards,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Rewards);
