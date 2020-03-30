import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Vitalik } from '../../../components';
import { dhm } from '../../../utils/utils';

const NS_TO_MS = 1 * 10 ** 6;

function RankParam({ data }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics
          title="calculation period"
          value={parseFloat(data.calculation_period)}
        />
        <CardStatisics
          title="damping factor"
          value={parseFloat(data.damping_factor)}
        />
        <CardStatisics title="tolerance" value={parseFloat(data.tolerance)} />
      </Pane>
    );
  } catch (error) {
    console.warn('RankParam', error);
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

export default RankParam;
