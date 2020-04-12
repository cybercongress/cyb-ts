import React, { Component } from 'react';

import { AUCTION } from '../../utils/config';

const { ADDR_SMART_CONTRACT } = AUCTION;

export class ClaimedRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
    this.smart = ADDR_SMART_CONTRACT;
  }

  claimedToken = account => {
    const { web3, contract, day } = this.props;
    console.log(account);
    try {
      web3.eth.sendTransaction({
        from: account,
        to: this.smart,
        data: contract.methods.claim(day).encodeABI(),
      });
      this.setState({
        status: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  getAccount = async () => {
    const { web3 } = this.props;
    if (web3.currentProvider.host)
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.claimedToken(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.claimedToken(accounts[0]);
      }
    } else return console.log('Your metamask is locked!');
  };

  render() {
    const { children } = this.props;
    return (
      <button
        onClick={this.getAccount}
        className="bnt-claime"
        disabled={this.state.status}
      >
        {children}
      </button>
    );
  }
}
