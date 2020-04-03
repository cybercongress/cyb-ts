import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DISTRIBUTION, COSMOS } from '../../../utils/config';
import { Dots } from '../../../components';
import { getTakeoff } from '../../../utils/game-monitors';
import { formatNumber, getDelegator } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolTakeOff } from '../../../redux/actions/gol';

const Takeoff = ({
  won = 0,
  takeoffDonations,
  addressLedger,
  setGolTakeOffProps,
  takeoff,
}) => {
  try {
    const [loading, setLoading] = useState(true);
    const [cybWonPercent, setCybWonPercent] = useState(0);
    const currentPrize = Math.floor(won);

    useEffect(() => {
      if (addressLedger !== null) {
        const fetchData = async () => {
          const takeoffAccount = await getTakeoff(
            addressLedger.bech32 || addressLedger,
            takeoffDonations
          );
          const cybAbsolute = takeoffAccount * currentPrize;
          setGolTakeOffProps(Math.floor(cybAbsolute), currentPrize);
          if (cybAbsolute !== 0) {
            const cybPercent = (cybAbsolute / currentPrize) * 100;
            setCybWonPercent(cybPercent);
          }
          setLoading(false);
        };
        fetchData();
      } else {
        setGolTakeOffProps(0, currentPrize);
        setLoading(false);
      }
    }, [won, addressLedger]);

    return (
      <RowTable
        text={<Link to="/takeoff">takeoff</Link>}
        reward={DISTRIBUTION.takeoff}
        currentPrize={currentPrize}
        cybWonAbsolute={
          loading ? <Dots /> : formatNumber(Math.floor(takeoff.cybAbsolute))
        }
        cybWonPercent={
          loading ? <Dots /> : `${formatNumber(cybWonPercent, 2)}%`
        }
      />
    );
  } catch (error) {
    console.warn(error);
    return (
      <RowTable
        text={<Link to="/takeoff">takeoff</Link>}
        reward={DISTRIBUTION.takeoff}
        currentPrize={won}
        cybWonAbsolute="∞"
        cybWonPercent="∞"
      />
    );
  }
};

const mapDispatchprops = dispatch => {
  return {
    setGolTakeOffProps: (amount, prize) =>
      dispatch(setGolTakeOff(amount, prize)),
  };
};

const mapStateToProps = store => {
  return {
    takeoff: store.gol.takeoff,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Takeoff);
