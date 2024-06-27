import React from 'react';

import ActionBarCenter from 'src/components/actionBar';

function ActionBar() {
  return (
    <ActionBarCenter
      button={{
        text: 'Register to root',
        disabled: true,
        onClick: () => {
          console.log('Create');
        },
      }}
    ></ActionBarCenter>
  );
}

export default ActionBar;
