import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import Txs from '../tx';

function ConsensusTab({ activeValidatorsCount, stakedCyb, inlfation }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title="heroes"
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4ed6ae" marginLeft={5} />}
          />
        </Link>
        <CardStatisics title="% of staked CYB" value={stakedCyb} />
        <CardStatisics
          title="inlfation"
          value={`${formatNumber(inlfation * 100, 2)} %`}
        />
        <Link to="/network/euler/tx">
          <CardStatisics title="transactions" value={<Txs />} />
        </Link>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default ConsensusTab;
