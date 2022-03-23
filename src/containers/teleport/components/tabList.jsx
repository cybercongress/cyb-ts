import React from 'react';
import { Tablist } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';

import { TabBtn } from '../../../components';
import ButtonTeleport from './buttonGroup/indexBtn';

function TabList({ selected }) {
  const history = useHistory();

  const handleHistory = (to) => {
    history.push(to);
  };

  return (
    <Tablist
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
      // gridGap="10px"
      marginBottom={30}
      maxWidth="390px"
      width="375px"
      marginX="auto"
    >
      {/* <TabBtn
        text="add liquidity"
        isSelected={selected === 'add-liquidity'}
        to="/teleport/add-liquidity"
      /> */}
      {/* <TabBtn text="Swap" isSelected={selected === 'swap'} to="/teleport" /> */}
      {/* <TabBtn
        text="sub liquidity"
        isSelected={selected === 'sub-liquidity'}
        to="/teleport/sub-liquidity"
      /> */}
      <ButtonTeleport
        status="left"
        isSelected={selected === 'add-liquidity'}
        onClick={() => handleHistory('/teleport/add-liquidity')}
      >
        Add liquidity
      </ButtonTeleport>
      <ButtonTeleport
        status="center"
        isSelected={selected === 'swap'}
        onClick={() => handleHistory('/teleport')}
      >
        Swap
      </ButtonTeleport>
      <ButtonTeleport
        status="right"
        isSelected={selected === 'sub-liquidity'}
        onClick={() => handleHistory('/teleport/sub-liquidity')}
      >
        Sub liquidity
      </ButtonTeleport>
    </Tablist>
  );
}

export default TabList;
