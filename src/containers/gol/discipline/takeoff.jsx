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
}) => {
  try {
    const [loading, setLoading] = useState(true);
    const [cybWonAbsolute, setCybWonAbsolute] = useState(0);
    const [cybWonPercent, setCybWonPercent] = useState(0);
    const currentPrize = Math.floor(won);

    useEffect(() => {
      if (addressLedger !== null) {
        const fetchData = async () => {
          const takeoff = await getTakeoff(
            addressLedger.bech32,
            takeoffDonations
          );
          const cybAbsolute = takeoff * currentPrize;
          setCybWonAbsolute(cybAbsolute);
          if (cybAbsolute !== 0) {
            setGolTakeOffProps(Math.floor(cybAbsolute));
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
        text={<Link to="/takeoff">tareoff</Link>}
        reward={DISTRIBUTION.takeoff}
        currentPrize={currentPrize}
        cybWonAbsolute={
          loading ? <Dots /> : formatNumber(Math.floor(cybWonAbsolute))
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
        text={<Link to="/takeoff">tareoff</Link>}
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
    setGolTakeOffProps: total => dispatch(setGolTakeOff(total)),
  };
};

export default connect(null, mapDispatchprops)(Takeoff);
