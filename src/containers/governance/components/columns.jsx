import React from 'react';
import { Pane } from '@cybercongress/gravity';

const Columns = ({ title, children }) => (
  <Pane
    width="100%"
    display="grid"
    gridTemplateColumns="100%"
    gridGap="20px"
    gridAutoRows="max-content"
    alignItems="flex-start"
    // boxShadow="0 0 3px 0px #fff"
    paddingX={10}
    paddingTop={10}
    paddingBottom={15}
    borderRadius="5px"
  >
    <Pane maxHeight="20px" fontSize={20}>
      {title}
    </Pane>
    {children}
  </Pane>
);

export default Columns;
