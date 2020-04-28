import React from 'react';
import { Indicators, Card, ContainerCard } from '../../components/index';
import { CYBER, DISTRIBUTION } from '../../utils/config';
import { formatNumber } from '../../utils/utils';

const { DENOM_CYBER, DENOM_CYBER_G } = CYBER;

const Statistics = ({ atomLeff, won, price, discount, time }) => (
  <ContainerCard styles={{ alignItems: 'center', gridGap: '20px' }} col="5">
    <Card
      tooltipValue="The time left untill the end of the donations, in the case where less than 600000 ATOMs are donated"
      positionTooltip="bottom"
      title="Donations ends"
      value={time}
    />
    <Card
      title="ATOMs left"
      value={atomLeff}
      positionTooltip="bottom"
      tooltipValue="The accumulated ATOMs left before the end of the donations, in the case where less than 90 days pass from the start"
    />
    <Card
      title="Won GCYB"
      value={won}
      positionTooltip="bottom"
      tooltipValue={`CYBs won from cyber~Congress. The remaining ${formatNumber(
        DISTRIBUTION.takeoff / CYBER.DIVISOR_CYBER_G - won,
        3
      )}GCYB will be distributed between cyber~Congress seed donors if donations end at this amount.`}
    />

    <Card
      title="Current discount"
      value={`${discount}%`}
      positionTooltip="bottom"
      tooltipValue="The current, accumulated discount"
    />

    <Card
      title="ATOM/GCYB"
      value={price}
      positionTooltip="bottom"
      tooltipValue="The current ATOM/GCYBs price. 1 Giga CYB = 1,000,000,000 CYB. Calculated as a relation between the won CYBs and accumulated ATOMs. This price excludes the order of donation advantages."
    />
  </ContainerCard>
);

export default Statistics;
