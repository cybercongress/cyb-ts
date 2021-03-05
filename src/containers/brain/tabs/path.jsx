import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { TAKEOFF } from '../../../utils/config';

function PathTab({ activeValidatorsCount = 0 }) {
  try {
    const gol =
      (TAKEOFF.FINISH_AMOUNT / TAKEOFF.ATOMsALL + activeValidatorsCount / 146) /
      2;

    return (
      <>
        <Link to="/gol/takeoff">
          <CardStatisics
            title="Takeoff price, ATOM/GCYB"
            value={formatNumber(Math.floor(TAKEOFF.FINISH_PRICE * 1000) / 1000)}
            link
          />
        </Link>
        <Link to="/gol">
          <CardStatisics
            title="Game of Links Goal"
            value={`${formatNumber(gol * 100, 2)}%`}
            link
          />
        </Link>
        <Link to="/search/master">
          <CardStatisics
            // title="Homestead"
            styleContainer={{
              justifyContent: 'center',
              padding: '65px 0',
              fontSize: '26px',
            }}
            styleTitle={{ fontSize: '26px' }}
            title="Master"
            link
          />
        </Link>
        <Link to="/heroes">
          <CardStatisics
            // title="Homestead"
            styleContainer={{
              justifyContent: 'center',
              padding: '65px 0',
              fontSize: '26px',
            }}
            styleTitle={{ fontSize: '26px' }}
            title="Hero"
            link
          />
        </Link>
        <Link to="/evangelism">
          <CardStatisics
            // title="Homestead"
            styleContainer={{
              justifyContent: 'center',
              padding: '65px 0',
              fontSize: '26px',
            }}
            styleTitle={{ fontSize: '26px' }}
            title="Evangelist"
            link
          />
        </Link>
        <Link to="/gol/takeoff">
          <CardStatisics
            // title="Homestead"
            styleContainer={{
              justifyContent: 'center',
              padding: '65px 0',
              fontSize: '26px',
            }}
            styleTitle={{ fontSize: '26px' }}
            title="Merchant"
            link
          />
        </Link>
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default PathTab;
