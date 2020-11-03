import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Indicators, Card, ContainerCard } from '../../components';
import { formatNumber } from '../../utils/utils';

const StatisticsClaim = ({ canClaim, raisedToken, roundAll, round }) => {
  if (round <= roundAll) {
    return (
      <Pane
        alignItems="center"
        gridGap="25px"
        display="grid"
        justifyItems="center"
        width="100%"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        marginBottom="20px"
      >
        <Card
          title="Awaiting claim"
          value={`${formatNumber(raisedToken, 3)} GGOL`}
          tooltipValue="The number of GOL tokens you will be able to claim, once the auction rounds you bid at, will end"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0', maxWidth: '250px' }}
        />
        <Card
          title="You can Claim"
          value={`${formatNumber(canClaim, 3)} GGOL`}
          tooltipValue="The total amount of GOL tokens you can claim right now"
          positionTooltip="bottom"
          stylesContainer={{ padding: '35px 0', maxWidth: '250px' }}
        />
      </Pane>
    );
  }
  if (round > roundAll) {
    return (
      <ContainerCard styles={{ alignItems: 'center' }} col="1">
        <Card
          title="Raised"
          value={`${raisedToken} ETH`}
          tooltipValue="The number of the total ETH, currently, raised"
          positionTooltip="bottom"
        />
      </ContainerCard>
    );
  }
  return null;
};

export default StatisticsClaim;
