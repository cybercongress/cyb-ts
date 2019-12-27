import React, { Component } from 'react';
import { ActionBar } from '@cybercongress/gravity';
import ActionBarTakeOff from '../funding/actionBar';
import ActionBarAuction from '../auction/actionBar';

const Switch = ({ checked, onChange }) => (
  <div className="container-switch">
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} /> <div />
    </label>
  </div>
);

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'start',
      select: 'atom',
      checkedSwitch: false,
    };
  }

  onChangeSelect = event => {
    this.setState({
      select: event.target.value,
    });
  };

  onClickSelect = () => {
    const { select } = this.state;
    this.setState({
      step: select,
    });
  };

  startStep = () => {
    this.setState({
      step: 'start',
    });
  };

  onChangeSwitch = e => {
    this.setState({
      checkedSwitch: e.target.checked,
    });
  };

  render() {
    const { checkedSwitch } = this.state;

    if (this.state.step === 'start') {
      return (
        <ActionBar>
          <div className="action-text">
            <span className="actionBar-text">Contribute ETH/ATOMs using</span>
            <Switch
              checked={checkedSwitch}
              onChange={e => this.onChangeSwitch(e)}
            />
            {/* <select onChange={this.onChangeSelect}>
              <option value="atom">ATOMs</option>
              <option value="eth">ETH</option>
            </select> */}
          </div>
          <button className="btn" onClick={this.onClickSelect}>
            Fuck Google
          </button>
        </ActionBar>
      );
    }

    if (!checkedSwitch) {
      return <ActionBarTakeOff update={this.startStep} />;
    }

    if (checkedSwitch) {
      return (
        <ActionBarAuction
          web3={this.props.web3}
          contract={this.props.contract}
          minRound={10}
          maxRound={11}
          update={this.startStep}
        />
      );
    }
    return null;
  }
}

export default ActionBarContainer;
