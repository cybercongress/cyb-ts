import { Tablist } from '@cybercongress/gravity';
import { useNavigate } from 'react-router-dom';

import ButtonTeleport from './buttonGroup/indexBtn';

function TabList({ selected }) {
  const history = useNavigate();

  const handleHistory = (to) => {
    history(to);
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
      <ButtonTeleport
        status="left"
        isSelected={selected === 'add-liquidity'}
        onClick={() => handleHistory('/warp/add-liquidity')}
      >
        Add liquidity
      </ButtonTeleport>
      <ButtonTeleport
        status="center"
        isSelected={selected === 'create-pool'}
        onClick={() => handleHistory('/warp/create-pool')}
      >
        Create pool
      </ButtonTeleport>
      <ButtonTeleport
        status="right"
        isSelected={selected === 'sub-liquidity'}
        onClick={() => handleHistory('/warp/sub-liquidity')}
      >
        Sub liquidity
      </ButtonTeleport>
    </Tablist>
  );
}

export default TabList;
