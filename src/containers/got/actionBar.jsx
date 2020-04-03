import React, { Component } from 'react';
import { ActionBar, Tab, Input, Pane } from '@cybercongress/gravity';
import ActionBarAtom from './actionBarAtom';
import ActionBarETH from './actionBarEth';

// const Switch = ({ checked, onChange }) => (
//   <div className="container-switch">
//     <input type="radio" checked={checked} onChange={onChange} /> <div />
//     <label className="switch">
//       ATOMs
//     </label>
//   </div>
// );

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'start',
      select: 'atom',
      checkedSwitch: false,
      valueAmount: '',
      givenProviderNull: false,
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
      valueAmount: '',
    });
  };

  onChangeSwitchAtom = e => {
    this.setState({
      checkedSwitch: false,
    });
  };

  onChangeSwitchEth = async e => {
    const { web3 } = this.props;
    if (web3.currentProvider.host) {
      this.setState({
        givenProviderNull: true,
      });
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.setState({
            checkedSwitch: true,
          });
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.setState({
          checkedSwitch: true,
        });
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  onChangeAmount = e =>
    this.setState({
      valueAmount: e.target.value,
    });

  render() {
    const { checkedSwitch, valueAmount, givenProviderNull } = this.state;

    if (givenProviderNull) {
      return (
        <ActionBar>
          <Pane
            display="flex"
            fontSize="20px"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            marginRight="15px"
          >
            <span>Please install</span>
            &nbsp;
            <a href="https://metamask.io/" target="_blank">
              Metamask extension
            </a>
            &nbsp;
            <span>and refresh the page</span>
          </Pane>
        </ActionBar>
      );
    }

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
              width="25%"
              height={42}
              fontSize="20px"
              textAlign="end"
            />
            <Pane>
              <Tab
                isSelected={!checkedSwitch}
                onSelect={e => this.onChangeSwitchAtom()}
                color="#36d6ae"
                boxShadow="0px 0px 10px #36d6ae"
                minWidth="100px"
                marginX={0}
                paddingX={10}
                paddingY={10}
                fontSize="18px"
                height={42}
              >
                ATOMs
              </Tab>
              <Tab
                isSelected={checkedSwitch}
                onSelect={e => this.onChangeSwitchEth()}
                color="#36d6ae"
                boxShadow="0px 0px 10px #36d6ae"
                minWidth="100px"
                marginX={0}
                paddingX={10}
                paddingY={10}
                fontSize="18px"
                height={42}
              >
                ETH
              </Tab>
            </Pane>
            {/* <span style={{ marginLeft: 10 }} className="actionBar-text">
              ATOMs/ETH
            </span> */}
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
        <ActionBarETH
          web3={this.props.web3}
          contract={this.props.contract}
          minRound={10}
          update={this.startStep}
          valueAmount={valueAmount}
        />
      );
    }
    return null;
  }
}

export default ActionBarContainer;
