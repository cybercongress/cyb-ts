import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getRewards } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const CommunityPool = ({ validatorAddress, reward = 0, won = 0 }) => {
  const [loading, setLoading] = useState(false);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = 0;

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

export default CommunityPool;
