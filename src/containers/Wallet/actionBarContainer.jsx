import React, { Component } from 'react';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';

class ActionBarContainer extends Component {
  render() {
    const { address } = this.props;

    return (
      <ActionBar>
        <Pane>
          <Text color='#fff' fontSize="18px">Address</Text>
          {/* <Text color='#fff' fontSize="18px">{address}</Text> */}
        </Pane>
      </ActionBar>
    );
  }
}

export default ActionBarContainer;
