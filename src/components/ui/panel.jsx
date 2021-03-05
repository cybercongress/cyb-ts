import React from 'react';
import { Pane } from '@cybercongress/gravity';

function Panel({ children, ...props }) {
  return (
    <Pane className="panel" {...props}>
      {children}
    </Pane>
  );
}

export default Panel;
