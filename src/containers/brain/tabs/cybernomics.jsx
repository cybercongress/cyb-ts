import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function CybernomicsTab({ data }) {
  try {
    const { gol, cyb, eul } = data;
    return (
      <>
        <CardStatisics title="GOL supply" value={formatNumber(gol.supply)} />
        <Link
          to="/gol/faucet"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title="Faucet price of GGOL in ETH"
            value={formatNumber(gol.price)}
            link
          />
        </Link>
        <CardStatisics title="GOL cap in ETH" value={formatNumber(gol.cap)} />

        <CardStatisics title="EUL supply" value={formatNumber(eul.supply)} />
        <Link
          to="/gol/faucet"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title="Faucet price of GEUL in ETH"
            value={formatNumber(eul.price)}
            link
          />
        </Link>
        <CardStatisics title="EUL cap in ETH" value={formatNumber(eul.cap)} />

        <CardStatisics title="CYB supply" value={formatNumber(cyb.supply)} />
        <Link to="/gol/takeoff">
          <CardStatisics
            title="Takeoff price of GCYB in ATOM"
            value={formatNumber(cyb.price)}
            link
          />
        </Link>
        <CardStatisics title="CYB cap in ATOM" value={formatNumber(cyb.cap)} />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default CybernomicsTab;
