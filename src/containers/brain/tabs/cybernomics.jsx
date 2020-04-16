import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function CybernomicsTab({ data }) {
  try {
    const { gol, cyb, eul } = data;
    return (
      <Pane display="grid" gridGap="20px">
        <Pane
          display="grid"
          gridGap="20px"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        >
          <CardStatisics title="GOL supply" value={formatNumber(gol.supply)} />
          <CardStatisics
            title="faucet price of GGOL in ETH"
            value={formatNumber(gol.price)}
          />
          <CardStatisics title="GOL cap in ETH" value={formatNumber(gol.cap)} />
        </Pane>
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gridGap="20px"
        >
          <CardStatisics title="EUL supply" value={formatNumber(eul.supply)} />
          <CardStatisics
            title="faucet price of GEUL in ETH"
            value={formatNumber(eul.price)}
          />
          <CardStatisics title="EUL cap in ETH" value={formatNumber(eul.cap)} />
        </Pane>
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gridGap="20px"
        >
          <CardStatisics title="CYB supply" value={formatNumber(cyb.supply)} />
          <CardStatisics
            title="takeoff price of GCYB in ATOM"
            value={formatNumber(cyb.price)}
          />
          <CardStatisics
            title="CYB cap in ATOMs"
            value={formatNumber(cyb.cap)}
          />
        </Pane>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default CybernomicsTab;
