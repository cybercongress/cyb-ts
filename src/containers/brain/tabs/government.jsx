import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

function GovernmentTab({ communityPool }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 250px))"
        gridGap="20px"
        justifyContent="center"
      >
        <Link to="/governance">
          <CardStatisics
            title={`community pool, ${CYBER.DENOM_CYBER.toLocaleUpperCase()}`}
            value={formatNumber(communityPool)}
          />
        </Link>
        <Link to="/network/euler/parameters">
          <CardStatisics title="Network parameters" value={30} />
        </Link>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default GovernmentTab;
