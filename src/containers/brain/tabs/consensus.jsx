import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import Txs from '../tx';

function ConsensusTab({ activeValidatorsCount, stakedCyb, inlfation }) {
  try {
    return (
      <>
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics title="Heroes" value={activeValidatorsCount} link />
        </Link>
        <CardStatisics
          title="% of staked EUL"
          value={formatNumber(stakedCyb * 100, 3)}
        />
        <CardStatisics
          title="Inflation"
          value={`${formatNumber(inlfation * 100, 2)} %`}
        />
        <Link to="/network/euler/tx">
          <CardStatisics title="Transactions" value={<Txs />} link />
        </Link>
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default ConsensusTab;
