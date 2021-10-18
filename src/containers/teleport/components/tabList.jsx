import React from 'react';
import { Tablist } from '@cybercongress/gravity';
import { TabBtn } from '../../../components';

function TabList({ selected }) {
  return (
    <Tablist
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
      gridGap="10px"
      marginBottom={30}
    >
      <TabBtn
        text="add liquidity"
        isSelected={selected === 'add-liquidity'}
        to="/teleport/add-liquidity"
      />
      <TabBtn text="Swap" isSelected={selected === 'swap'} to="/teleport" />
      <TabBtn
        text="sub liquidity"
        isSelected={selected === 'sub-liquidity'}
        to="/teleport/sub-liquidity"
      />
    </Tablist>
  );
}

export default TabList;
