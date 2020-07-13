import React, { Component } from 'react';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { AUCTION } from '../../utils/config';

function lament(error) {
  if (error) {
    document.querySelector('.before-error').outerHTML += `
      <div class="error pane">
        <h3>${error.message}</h3>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

const hopefully = $ => (error, result) => {
  if (error) {
    lament(error);
  } else {
    $(result);
  }
};

const ping = tx =>
  new Promise((resolve, reject) => {
    loop();
    function loop() {
      window.web3.eth.getTransactionReceipt(tx, async (error, receipt) => {
        if (receipt == null) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }

        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }
      });
    }
  });

const ActionBarContentText = ({ children, ...props }) => (
  <Pane
    display="flex"
    fontSize="20px"
    justifyContent="center"
    alignItems="center"
    flexGrow={1}
    marginRight="15px"
    {...props}
  >
    {children}
  </Pane>
);

const ContributeETH = ({ onClickBtn, valueAmount }) => (
  <ActionBar>
    <ActionBarContentText>
      I want to contribute {valueAmount} <span>ETH</span>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>Confirm</Button>
  </ActionBar>
);

const Succesfuuly = ({ onClickBtn, hash }) => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      <div className="text-default">
        Your TX has been broadcast to the network. It is waiting to be mined &
        confirned.
      </div>
      <div className="text-default">
        Check TX status:{' '}
        <a
          className="hash"
          href={`https://etherscan.io/tx/${hash}`}
          target="_blank"
        >
          {hash}
        </a>
      </div>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>OK</Button>
  </ActionBar>
);


class ActionBarETH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'contributeETH',
      round: '',
      tx: null,
    };
    this.smart = AUCTION.ADDR_SMART_CONTRACT;
  }

  onClickSaveAddress = () => {
    const { update } = this.props;
    this.setState({
      step: 'contributeETH',
      round: '',
    });
    if (update) {
      update();
    }
  };

  buyTOKEN = async account => {
    const { web3, contract, valueAmount } = this.props;
    const { round } = this.state;

    const getData = await contract.methods.buyWithLimit(round, 0).encodeABI();

    const priceInWei = await web3.utils.toWei(valueAmount, 'ether');
    web3.eth.sendTransaction(
      {
        from: account,
        to: this.smart,
        value: priceInWei,
        data: getData,
      },
      hopefully(result =>
        ping(result).then(() => {
          this.setState({
            step: 'succesfuuly',
            tx: result,
          });
        })
      )
    );
  };

  onClickContributeETH = async () => {
    const { web3 } = this.props;
    if (web3.currentProvider.host) {
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.buyTOKEN(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.buyTOKEN(accounts[0]);
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  render() {
    const { step, tx } = this.state;
    const { web3, valueAmount } = this.props;

    if (web3.givenProvider === null) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <span>Please install</span>
            &nbsp;
            <a href="https://metamask.io/" target="_blank">
              Metamask extension
            </a>
            &nbsp;
            <span>and refresh the page</span>
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (step === 'contributeETH') {
      return (
        <ContributeETH
          valueAmount={valueAmount}
          onClickBtn={this.onClickContributeETH}
        />
      );
    }

    if (step === 'succesfuuly') {
      return <Succesfuuly hash={tx} onClickBtn={this.onClickSaveAddress} />;
    }

    return null;
  }
}

export default ActionBarETH;
