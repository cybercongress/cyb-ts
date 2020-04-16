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
      <ContainerCard styles={{ alignItems: 'center', gridGap: '25px' }} col="5">
        <Card
          title="Round"
          value={`${round} of ${roundAll}`}
          tooltipValue="The current round of total number in the Auction"
          positionTooltip="bottom"
          stylesContainer={{padding: "35px 0"}}
        />
        <Card
          title="Raised"
          value={`${raised} ETH`}
          tooltipValue="The number of total ETH raised currently"
          positionTooltip="bottom"
          stylesContainer={{padding: "35px 0"}}
        />
        <Card
          title="Current price"
          value={`${currentPrice} ETH/G${TOKEN_NAME}`}
          tooltipValue="The current price ETH/GOL calculated according to the current round"
          positionTooltip="bottom"
          stylesContainer={{padding: "35px 0"}}
        />
        <Card
          title="Left in round"
          value={timeLeft}
          tooltipValue="Time left in the current round closing"
          positionTooltip="bottom"
          stylesContainer={{padding: "35px 0"}}
        />
        <Card
          title={`${TOKEN_NAME} CAP`}
          value={`${cap} ETH`}
          tooltipValue="GOL market cap in ETH"
          positionTooltip="bottom"
          stylesContainer={{padding: "35px 0"}}
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