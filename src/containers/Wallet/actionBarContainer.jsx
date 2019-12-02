import React, { Component } from 'react';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';

const STAGE_INIT = 0;
const STAGE_LEDGER_INIT = 1;
const STAGE_READY = 2;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      table: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: false,
    };
  }

  onClickSend = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  render() {
    const { address, onClickAddressLedger, addAddress, send } = this.props;
    if (addAddress) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={onClickAddressLedger}>add address</Button>
          </Pane>
        </ActionBar>
      );
    }
    if (!addAddress) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={e => this.onClickSend(e)}>send</Button>
          </Pane>
        </ActionBar>
      );
    }
    return null;
  }
}

export default ActionBarContainer;
