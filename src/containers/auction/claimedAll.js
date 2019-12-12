import React, { Component } from 'react';
import { Button } from '@cybercongress/gravity';

import { AUCTION } from '../../utils/config';

const { ADDR_SMART_CONTRACT } = AUCTION;

export class ClaimedAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false
    };
    this.smart = ADDR_SMART_CONTRACT;
  }

  claimedToken = account => {
    const { web3, contract } = this.props;
    console.log(account);
    try {
      web3.eth.sendTransaction({
        from: account,
        to: this.smart,
        data: contract.methods.claimAll().encodeABI()
      });
      this.setState({
        status: true
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
    const { children, styles, ...props } = this.props;
    return (
      <Button {...props} onClick={this.getAccount}>
        {children}
      </Button>
    );
  }
}
