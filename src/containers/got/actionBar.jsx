import React, { Component } from 'react';
import { ActionBar, Input } from '@cybercongress/gravity';
import ActionBarAtom from './actionBarAtom';
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
      valueAmount: '',
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

  onChangeAmount = e =>
    this.setState({
      valueAmount: e.target.value,
    });

  render() {
    const { checkedSwitch, valueAmount } = this.state;

    if (this.state.step === 'start') {
      return (
        <ActionBar>
          <div className="action-text">
            <span className="actionBar-text">Contribute</span>
            <Input
              value={valueAmount}
              onChange={this.onChangeAmount}
              placeholder="amount"
              // isInvalid={validAmount}
              // message={messageAmount}
              marginLeft={10}
              marginRight={10}
              width="10%"
              height={32}
            />
            <Switch
              checked={checkedSwitch}
              onChange={e => this.onChangeSwitch(e)}
            />
            <span style={{ marginLeft: 10 }} className="actionBar-text">
              ATOMs/ETH
            </span>
          </div>
          <button className="btn" onClick={this.onClickSelect}>
            Fuck Google
          </button>
        </ActionBar>
      );
    }

    if (!checkedSwitch) {
      return (
        <ActionBarAtom valueAmount={valueAmount} update={this.startStep} />
      );
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
