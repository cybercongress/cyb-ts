import React from 'react';
import { Indicators, Card, ContainerCard } from '../../components/index';

export const Statistics = ({
  round,
  roundAll,
  timeLeft,
  currentPrice,
  raised,
  cap,
  TOKEN_NAME
}) => {
  if (round <= roundAll) {
    return (
      <ContainerCard styles={{ alignItems: 'center' }} col="5">
        <Indicators
          title="Round"
          value={`${round} of ${roundAll}`}
          tooltipValue="The current round of total number in the Auction"
          positionTooltip="bottom"
        />
        <Indicators
          title="Raised"
          value={`${raised} ETH`}
          tooltipValue="The number of total ETH raised currently"
          positionTooltip="bottom"
        />
        <Card
          title="Current price"
          value={`${currentPrice} ETH/G${TOKEN_NAME}`}
          tooltipValue="The current price ETH/GOL calculated according to the current round"
          positionTooltip="bottom"
        />
        <Indicators
          title="Left in round"
          value={`${timeLeft} hour`}
          tooltipValue="Time left in the current round closing"
          positionTooltip="bottom"
        />
        <Indicators
          title={`${TOKEN_NAME} CAP`}
          value={`${cap} ETH`}
          tooltipValue="GOL market cap in ETH"
          positionTooltip="bottom"
        />
      </ContainerCard>
    );
  }
  if (round > roundAll) {
    return (
      <ContainerCard styles={{ alignItems: 'center' }} col="1">
        <Card
          title="Raised"
          value={`${raised} ETH`}
          tooltipValue="The number of total ETH raised currently"
          positionTooltip="bottom"
        />
      </ContainerCard>
    );
  }
  return null;
};
