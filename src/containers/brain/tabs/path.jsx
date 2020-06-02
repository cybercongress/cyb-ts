import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function PathTab() {
  return (
    <>
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
}

export default PathTab;
