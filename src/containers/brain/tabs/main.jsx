import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function MainTab({ linksCount, capATOM, activeValidatorsCount }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics title="cyberlinks" value={formatNumber(linksCount)} />
        <CardStatisics
          title="EUL cap in ETH"
          value={formatNumber(Math.floor(capATOM * 1000) / 1000)}
        />
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics title="heroes" value={activeValidatorsCount} link />
        </Link>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default MainTab;
