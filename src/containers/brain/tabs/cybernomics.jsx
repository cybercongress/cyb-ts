import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function CybernomicsTab({ totalCyb, takeofPrice, capATOM }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics title="EUL supply" value={formatNumber(totalCyb)} />
        <CardStatisics
          title="takeoff price of GEUL in ATOM"
          value={formatNumber(takeofPrice)}
        />
        <CardStatisics
          title="EUL cap in ATOMs"
          value={formatNumber(Math.floor(capATOM * 1000) / 1000)}
        />
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default CybernomicsTab;
