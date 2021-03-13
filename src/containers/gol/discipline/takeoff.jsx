import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DISTRIBUTION, COSMOS } from '../../../utils/config';
import { Dots } from '../../../components';
import { getTakeoff } from '../../../utils/game-monitors';
import { formatNumber, fromBech32 } from '../../../utils/utils';
import RowTable from '../components/row';
import { setGolTakeOff } from '../../../redux/actions/gol';

const Takeoff = ({ takeoff }) => {
  try {
    return (
      <RowTable
        text={<Link to="/gol/takeoff">takeoff</Link>}
        reward={DISTRIBUTION.takeoff}
        currentPrize={takeoff.currentPrize}
        cybWonAbsolute={formatNumber(Math.floor(takeoff.cybAbsolute))}
        cybWonPercent={`${
          takeoff.cybAbsolute > 0 && takeoff.currentPrize > 0
            ? formatNumber(
                (takeoff.cybAbsolute / takeoff.currentPrize) * 100,
                2
              )
            : 0
        }%`}
      />
    );
  } catch (error) {
    console.warn(error);
    return (
      <RowTable
        text={<Link to="/gol/takeoff">takeoff</Link>}
        reward={DISTRIBUTION.takeoff}
        currentPrize={takeoff.currentPrize}
        cybWonAbsolute="∞"
        cybWonPercent="∞"
      />
    );
  }
};

const mapDispatchprops = (dispatch) => {
  return {
    setGolTakeOffProps: (amount, prize) =>
      dispatch(setGolTakeOff(amount, prize)),
  };
};

const mapStateToProps = (store) => {
  return {
    takeoff: store.gol.takeoff,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(Takeoff);
