import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function MainTab({ linksCount, cybernomics, activeValidatorsCount, donation }) {
  try {
    const gol = (donation + activeValidatorsCount / 146) / 2;
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <Link to="/graph">
          <CardStatisics
            title="Cyberlinks"
            value={formatNumber(linksCount)}
            link
          />
        </Link>
        <Link to="/gol/takeoff">
          <CardStatisics
            title="Takeoff"
            value={formatNumber(cybernomics.cyb.price)}
            link
          />
        </Link>
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics title="Heroes" value={activeValidatorsCount} link />
        </Link>
        <LinkWindow to="https://github.com/cybercongress/congress/blob/master/ecosystem/Cyber%20Homestead%20doc.md">
          <CardStatisics
            // title="Homestead"
            styleContainer={{
              justifyContent: 'center',
              padding: '65px 0',
              fontSize: '26px',
            }}
            styleTitle={{ fontSize: '26px' }}
            title="Homestead"
            link
          />
        </LinkWindow>
        <Link to="/gol">
          <CardStatisics
            title="Game of Links Goal"
            value={`${formatNumber(gol * 100, 2)}%`}
            link
          />
        </Link>
        <Link
          to="/gol/faucet"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            styleContainer={{ justifyContent: 'center', fontSize: '26px' }}
            styleTitle={{ fontSize: '26px' }}
            title="Get will"
            link
          />
        </Link>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default MainTab;
