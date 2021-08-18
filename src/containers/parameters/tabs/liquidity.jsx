import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Vitalik } from '../../../components';
import { dhm } from '../../../utils/utils';

const NS_TO_MS = 1 * 10 ** 6;

function LiquidityParam({ data }) {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gridGap="20px"
    >
      <CardStatisics title="code upload access" value="Everybody" />
      <CardStatisics title="instantiate default permission" value="Everybody" />
      <CardStatisics title="max wasm code size" value="600 KB" />
    </Pane>
  );
}

export default LiquidityParam;
