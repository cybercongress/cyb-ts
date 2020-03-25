import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DISTRIBUTION } from '../../../utils/config';
import { Dots } from '../../../components';
import { getLoad } from '../../../utils/game-monitors';
import { formatNumber } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolLoad } from '../../../redux/actions/gol';

const Load = ({ addressLedger, reward = 0, won = 0, golLoadProps, load }) => {
  const [loading, setLoading] = useState(true);
  const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
  const [cybWonPercent, setCybWonPercent] = useState(0);
  const currentPrize = Math.floor(
    (won / DISTRIBUTION.takeoff) * DISTRIBUTION.load
  );

  useEffect(() => {
    if (addressLedger !== null) {
      const fetchData = async () => {
        const data = await getLoad(addressLedger.bech32);
        const cybAbsolute = data * currentPrize;
        setCybWonAbsolute(cybAbsolute);
        golLoadProps(cybAbsolute);
        if (cybAbsolute !== 0) {
          const cybPercent = (cybAbsolute / currentPrize) * 100;
          setCybWonPercent(cybPercent);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [won, addressLedger]);

  return (
    <RowTable
      text={<Link to="/gol/load">load</Link>}
      reward={DISTRIBUTION.load}
      currentPrize={currentPrize}
      cybWonAbsolute={loading ? <Dots /> : formatNumber(Math.floor(load))}
      cybWonPercent={loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`}
    />
  );
};

const mapDispatchprops = dispatch => {
  return {
    golLoadProps: golLoad => dispatch(setGolLoad(golLoad)),
  };
};

const mapStateToProps = store => {
  return {
    load: store.gol.load,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Load);
