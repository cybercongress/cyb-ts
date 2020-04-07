import React from 'react';
import { Pane } from '@cybercongress/gravity';

function PocketCard({ children, select, ...props }) {
  return (
    <Pane
      boxShadow={select ? '0 0 15px #3ab793' : '0px 0px 5px #36d6ae'}
      className="container-card cursor-pointer"
      width="100%"
      maxWidth="unset"
      paddingX={20}
      paddingY={20}
      {...props}
    >
      {children}
    </Pane>
  );
}

export default PocketCard;
