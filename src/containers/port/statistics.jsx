import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Indicators, Card, ContainerCard, LinkWindow } from '../../components';
import {
  CYBER,
  DISTRIBUTION,
  GENESIS_SUPPLY,
  TAKEOFF,
} from '../../utils/config';
import { formatNumber, exponentialToDecimal } from '../../utils/utils';

const { DENOM_CYBER, DENOM_CYBER_G } = CYBER;

const CYBER_ALL_PORT = 50000;

const Statistics = ({ marketData, time = '∞' }) => {
  const { currentPrice, ethDonated, eulsWon, loading } = marketData;
  return (
    // <ContainerCard styles={{ alignItems: 'center', gridGap: '20px' }} col="3">
    <Pane
      marginTop={10}
      marginBottom={10}
      display="grid"
      justifyItems="center"
      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
      gridGap="20px"
    >
      <Card
        title="ETH/GCYB"
        value={exponentialToDecimal(currentPrice.toPrecision(6))}
        positionTooltip="bottom"
        tooltipValue={
          <span style={{ fontSize: '14px' }}>
            The current ETH/GCYB price. 1 Giga CYB = 1,000,000,000 CYB.
          </span>
        }
      />
      <Card
        title="GCYB left"
        // value={atomLeff >= 0 ? formatNumber(atomLeff) : 0}
        value={formatNumber(
          Math.floor(CYBER_ALL_PORT - eulsWon / CYBER.DIVISOR_CYBER_G)
        )}
        positionTooltip="bottom"
        tooltipValue="GCYB left for distribution on arrival"
      />
      <Card
        title="Donations, ETH"
        value={exponentialToDecimal(ethDonated.toPrecision(6))}
        positionTooltip="bottom"
        // tooltipValue="The GCYB left before the end of the donations, in the case where less than 146 days pass from the start"
      />
      {/* // </ContainerCard> */}
    </Pane>
  );
};

export default Statistics;
