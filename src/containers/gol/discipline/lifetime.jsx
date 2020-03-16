import React, { useEffect, useState } from 'react';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getDelegation } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';

const Lifetime = ({
  validatorAddress,
  subscribeToNewComments,
  reward = 0,
  won = 0,
  data,
  entry,
  document,
}) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
  );

  useEffect(() => {
    subscribeToNewComments();
  }, []);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getDelegation(validatorAddress);
  //     const cybAbsolute = data * currentPrize;
  //     setCybWonAbsolute(cybAbsolute);
  //     if (cybAbsolute !== 0) {
  //       const cybPercent = (cybAbsolute / currentPrize) * 100;
  //       setCybWonPercent(cybPercent);
  //     }
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [won, validatorAddress]);

  return (
    <RowTable
      text="lifetime"
      reward={DISTRIBUTION.delegation}
      currentPrize={currentPrize}
      cybWonAbsolute={
        loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
      }
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

export default Lifetime;
