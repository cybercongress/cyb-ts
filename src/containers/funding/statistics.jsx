import React from 'react';
import { Indicators, Card, ContainerCard } from '../../components/index';

const Statistics = ({ atomLeff, won, price, discount }) => (
  <ContainerCard styles={{ alignItems: 'center' }} col="5">
    <Indicators
      tooltipValue="The time left to finish funding in case less than 600000 ATOMs accumulated"
      positionTooltip="bottom"
      title="Funding ends"
      value="70 days"
    />
    <Indicators
      title="Current discount, %"
      value={discount}
      positionTooltip="bottom"
      tooltipValue="The advantage of price in the first donation of funding over the last one"
    />
    <Card
      title="ATOMs left"
      value={atomLeff}
      positionTooltip="bottom"
      tooltipValue="The accumulated ATOMs left before the end of Funding, in case less than 90 days funding duration"
    />
    <Indicators
      title="Won, GCYBs"
      value={won}
      positionTooltip="bottom"
      tooltipValue="CYBs won from cyber~Congress. The number of tokens will distribute between donators if Funding end at this amount."
    />
    <Indicators
      title="Current price, GCYBs/ATOM"
      value={price}
      positionTooltip="bottom"
      tooltipValue="The current CYBs/ATOM price. Calculated as relation between won CYBs and accumulated ATOMs. This price excluding the order of donation advantages."
    />
  </ContainerCard>
);

export default Statistics;
