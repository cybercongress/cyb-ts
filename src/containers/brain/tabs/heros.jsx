import React from 'react';
import { Link } from 'react-router-dom';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function HallofFameTab({ stakedCyb, activeValidatorsCount }) {
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
          <CardStatisics
            title="Heroes"
            value={activeValidatorsCount}
            styleContainer={{
              justifyContent: 'center',
              fontSize: '26px',
              minWidth: '310px',
              margin: '0 auto',
            }}
            link
          />
        </Link>
        <CardStatisics
          title="% of staked EUL"
          value={formatNumber(stakedCyb * 100, 3)}
          styleContainer={{
            justifyContent: 'center',
            fontSize: '26px',
            minWidth: '310px',
            margin: '0 auto',
          }}
        />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default HallofFameTab;
