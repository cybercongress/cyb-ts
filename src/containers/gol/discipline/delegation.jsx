import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getDelegation } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolDelegation } from '../../../redux/actions/gol';

const Delegation = ({
  validatorAddress,
  reward = 0,
  won = 0,
  setDelegationProps,
  delegation,
}) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
  );

  useEffect(() => {
    if (validatorAddress !== null) {
      const fetchData = async () => {
        const data = await getDelegation(validatorAddress);
        const cybAbsolute = data * currentPrize;
        setDelegationProps(Math.floor(cybAbsolute), currentPrize);
        if (cybAbsolute !== 0) {
          const cybPercent = (cybAbsolute / currentPrize) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setDelegationProps(0, currentPrize);
      setLoading(false);
    }
  }, [won, validatorAddress]);

  return (
    <RowTable
      text={<Link to="/gol/delegation">delegation</Link>}
      reward={DISTRIBUTION.delegation}
      currentPrize={currentPrize}
      cybWonAbsolute={loading ? <Dots /> : delegation.cybAbsolute}
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    setDelegationProps: (amount, prize) =>
      dispatch(setGolDelegation(amount, prize)),
  };
};

const mapStateToProps = store => {
  return {
    delegation: store.gol.delegation,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Delegation);
