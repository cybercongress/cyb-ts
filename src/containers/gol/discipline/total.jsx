import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const Total = ({
  load,
  takeoff,
  relevance,
  delegation,
  lifetime,
  euler4Rewards,
}) => {
  const [loading, setLoading] = useState(true);
  const [totalReward, setTotalReward] = useState(0);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const [currentPrize, setCurrentPrize] = useState(0);
  const cybWon = {
    load,
    takeoff,
    relevance,
    delegation,
    lifetime,
    euler4Rewards,
  };

  useEffect(() => {
    let total = 0;
    let rewardTotal = 0;
    let prize = 0;
    Object.keys(cybWon).forEach(keys => {
      total += cybWon[keys].cybAbsolute;
    });
    Object.keys(DISTRIBUTION).forEach(keys => {
      rewardTotal += DISTRIBUTION[keys];
    });
    Object.keys(cybWon).forEach(keys => {
      prize += cybWon[keys].currentPrize;
    });
    if (total > 0 && prize > 0) {
      setCybWonPercent((total / prize) * 100);
    }
    setCurrentPrize(prize);
    setTotalReward(rewardTotal);
    setCybWonAbsolute(total);
    setLoading(false);
  }, [cybWon]);

  return (
    <RowTable
      text={
        <LinkWindow to="https://cybercongress.ai/game-of-links/">
          total
        </LinkWindow>
      }
      reward={totalReward}
      currentPrize={currentPrize}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapStateToProps = store => {
  return {
    load: store.gol.load,
    takeoff: store.gol.takeoff,
    relevance: store.gol.relevance,
    delegation: store.gol.delegation,
    lifetime: store.gol.lifetime,
    euler4Rewards: store.gol.euler4Rewards,
  };
};

export default connect(mapStateToProps)(Total);
