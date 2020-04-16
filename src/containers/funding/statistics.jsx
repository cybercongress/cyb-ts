import React from 'react';
import { Indicators, Card, ContainerCard } from '../../components/index';
import { CYBER, DISTRIBUTION } from '../../utils/config';
import { formatNumber } from '../../utils/utils';

const { DENOM_CYBER, DENOM_CYBER_G } = CYBER;

const Statistics = ({ atomLeff, won, price, discount, time }) => (
  <ContainerCard styles={{ alignItems: 'center', gridGap: '20px' }} col="5">
    <Card
      tooltipValue="The time left to finish funding in case less than 600000 ATOMs donated"
      positionTooltip="bottom"
      title="Funding ends"
      value={time}
    />
    <Card
      title="ATOMs left"
      value={atomLeff}
      positionTooltip="bottom"
      tooltipValue="The accumulated ATOMs left before the end of Funding, in case less than 90 days funding duration"
    />
    <Card
      title={`Won ${DENOM_CYBER_G.toUpperCase()}`}
      value={won}
      positionTooltip="bottom"
      tooltipValue={`CYBs won from cyber~Congress. Remaining ${formatNumber(
        DISTRIBUTION.takeoff / CYBER.DIVISOR_CYBER_G - won,
        3
      )}GCYB will be distributed between cyber~Congress seed donors if funding end at this amount.`}
    />

    <Card
      title="Current discount"
      value={`${discount}%`}
      positionTooltip="bottom"
      tooltipValue="The advantage of price in the first donation of funding over the last one"
    />

    <Card
      title={`${DENOM_CYBER_G.toUpperCase()}/ATOM`}
      value={price}
      positionTooltip="bottom"
      tooltipValue="The current CYBs/ATOM price. Calculated as relation between won CYBs and accumulated ATOMs. This price excluding the order of donation advantages."
    />
  </ContainerCard>
);

export default Statistics;
