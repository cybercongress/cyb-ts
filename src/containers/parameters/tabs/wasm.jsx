import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Vitalik } from '../../../components';

const NS_TO_MS = 1 * 10 ** 6;

function WasmParam({ data }) {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gridGap="20px"
    >
      <CardStatisics title="code upload access" value="Everybody" />
      <CardStatisics title="instantiate default permission" value="Everybody" />
      <CardStatisics title="max wasm code size" value="1200 kB" />
    </Pane>
  );
}

export default WasmParam;
