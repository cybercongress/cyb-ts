import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, ContainerCard, Vitalik } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function BandwidthParam({ data }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics
          title="tx cost"
          value={formatNumber(parseFloat(data.tx_cost))}
        />
        <CardStatisics
          title="link msg cost"
          value={formatNumber(parseFloat(data.link_msg_cost))}
        />
        <CardStatisics
          title="non link msg cost"
          value={formatNumber(parseFloat(data.non_link_msg_cost))}
        />
        <CardStatisics
          title="recovery period blocks"
          value={formatNumber(parseFloat(data.recovery_period))}
        />
        <CardStatisics
          title="adjust price period blocks"
          value={formatNumber(parseFloat(data.adjust_price_period))}
        />
        <CardStatisics
          title="base credit price"
          value={formatNumber(Math.floor(data.base_credit_price))}
        />
        <CardStatisics
          title="desirable bandwidth"
          value={formatNumber(parseFloat(data.desirable_bandwidth))}
        />
        <CardStatisics
          title="max block bandwidth"
          value={formatNumber(parseFloat(data.max_block_bandwidth))}
        />
      </Pane>
    );
  } catch (error) {
    console.warn('BandwidthParam', error);
    return (
      <Pane
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        display="flex"
      >
        <Vitalik />
        Error !
      </Pane>
    );
  }
}

export default BandwidthParam;
