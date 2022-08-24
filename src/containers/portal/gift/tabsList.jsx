import React from 'react';
import { Tablist as Tabs } from '@cybercongress/gravity';
import Carousel from './carousel1/Carousel';
import ButtonTeleport from '../../teleport/components/buttonGroup/indexBtn';

const STEP_GIFT_INFO = 0;
const STEP_PROVE_ADD = 1;
const STEP_CLAIME = 2;

const slidesTest = [
  {
    title: 'STEP_GIFT_INFO',
  },
  {
    title: 'STEP_PROVE_ADD',
  },
  {
    title: 'STEP_CLAIME',
  },
];

// const Tab = ({ children, onClick }) => {
//   return <div onClick={onClick}>{children}</div>;
// };

// /* <Carousel slides={slidesTest} /> */

// function TabsList({ active, setStep }) {
//   return <Carousel slides={slidesTest} />;
// }

function TabsList({ active, setStep }) {
  return (
    <Tabs
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
      // gridGap="10px"
      // marginBottom={30}
      width="100%"
      marginX="auto"
    >
      <ButtonTeleport
        status="left"
        isSelected={active === STEP_GIFT_INFO}
        onClick={() => setStep(STEP_GIFT_INFO)}
      >
        about gift
      </ButtonTeleport>
      <ButtonTeleport
        status="center"
        isSelected={active === STEP_PROVE_ADD}
        onClick={() => setStep(STEP_PROVE_ADD)}
      >
        prove address
      </ButtonTeleport>
      <ButtonTeleport
        status="right"
        isSelected={active === STEP_CLAIME}
        onClick={() => setStep(STEP_CLAIME)}
      >
        claim
      </ButtonTeleport>
    </Tabs>
  );
}

export default TabsList;
