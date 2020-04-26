import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Indicators, Card, ContainerCard } from '../../components';

export const Statistics = ({
  round,
  roundAll,
  timeLeft,
  currentPrice,
  raised,
  cap,
  TOKEN_NAME,
}) => {
  if (round <= roundAll) {
    return (
      <Pane
        alignItems="center"
        gridGap="25px"
        display="grid"
        justifyItems="center"
        width="100%"
        gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        marginBottom="20px"
      >
        <Card
          title="Round"
          value={`${round} of ${roundAll}`}
          tooltipValue="The current round out of the total number of rounds in the Auction"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0' }}
        />
        <Card
          title="Raised"
          value={`${raised} ETH`}
          tooltipValue="The number of total ETH, currently, raised"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0' }}
        />
        <Card
          title="Current price"
          value={`${currentPrice} ETH/G${TOKEN_NAME}`}
          tooltipValue="The current price of ETH/GOL, calculated according to the current round"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0' }}
        />
        <Card
          title="Left in round"
          value={timeLeft}
          tooltipValue="The time left until the current round is closing"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0' }}
        />
        <Card
          title={`${TOKEN_NAME} CAP`}
          value={`${cap} ETH`}
          tooltipValue="GOL market cap in ETH"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0' }}
        />
      </Pane>
    );
  }
  if (round > roundAll) {
    return (
      <ContainerCard styles={{ alignItems: 'center' }} col="1">
        <Card
          title="Raised"
          value={`${raised} ETH`}
          tooltipValue="The number of the total ETH, currently, raised"
          positionTooltip="bottom"
        />
      </ContainerCard>
    );
  }
  return null;
};
