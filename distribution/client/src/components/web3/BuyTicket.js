import React, { Component } from 'react';

export class BuyButton extends Component {
  constructor(props) {
    super(props);
    this.smart = '0x61B81103e716B611Fff8aF5A5Dc8f37C628efb1E';
  }

  buyTicket = account => {
    const { web3, contract, tickets } = this.props;
    if (tickets.price) {
      const { price } = tickets;
      const priceInWei = web3.utils.toWei(price, 'ether');
      try {
        web3.eth.sendTransaction({
          from: account,
          to: this.smart,
          value: priceInWei,
          data: contract.methods.buyTicket().encodeABI()
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  getAccount = async () => {
    const { web3, setWarning } = this.props;
    if (web3.currentProvider.host)
      return setWarning(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.buyTicket(accounts[0]);
        }
      } catch (error) {
        setWarning('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.buyTicket(accounts[0]);
      }
    } else return setWarning('Your metamask is locked!');
  };

  render() {
    return (
      <button
        className="block-button-white"
        style={{ margin: '35px 0 0 45px' }}
        onClick={this.getAccount}
        disabled={!Object.keys(this.props.tickets).length}
      >
        BUY TICKET
      </button>
    );
  }
}
