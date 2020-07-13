import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { AUCTION, PATTERN_COSMOS, PATTERN_CYBER } from '../../utils/config';
import { Dots, LinkWindow } from '../../components';

const STAGE_START = 1;
const STAGE_ADD_CYBER = 2;
const STAGE_ADD_COSMOS = 3;
const STAGE_ADD_NICKNAME = 4;
const STAGE_ADD_GIT = 5;
const STAGE_ADD_KEYBASE = 6;
const STAGE_SING = 7;
const STAGE_SUBMITTED = 8;
const STAGE_CONFIRM = 9;
const STAGE_THANK = 10;

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

const Succesfuuly = ({ onClickBtn, hash }) => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      <div className="text-default">
        Your TX has been broadcasted to the network. It is waiting to be mined &
        confirmed.
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

const ThankSubmit = () => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      thank you for submitting! Now cyberlink something to get acknowledgement
      faster
    </ActionBarContentText>
    <Link
      style={{
        paddingTop: 10,
        margin: '0 15px',
        paddingBottom: 10,
        display: 'block',
      }}
      className="btn"
      to="/gol"
    >
      Play Game of Links
    </Link>
  </ActionBar>
);

class ActionBarEvangelism extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: STAGE_START,
      tx: null,
      keybaseName: '',
      githubUsername: '',
      nickname: '',
      cosmosAddress: '',
      cyberAddress: '',
    };
    this.smart = AUCTION.ADDR_EVANGELISM;
  }

  onChangeAmount = e =>
    this.setState({
      amount: e.target.value,
    });

  onClickFuckGoogle = async () => {
    const { minRound, web3 } = this.props;
    if (web3.currentProvider.host)
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.setState({
            step: 'contributeETH',
            round: minRound,
          });
        }
      } catch (error) {
        console.log('You declined the transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.setState({
          step: 'contributeETH',
          round: minRound,
        });
      }
    } else return console.log('Your metamask is locked!');
  };

  onClickSaveAddress = () => {
    this.setState({
      step: STAGE_THANK,
      tx: null,
      keybaseName: '',
      githubUsername: '',
      nickname: '',
      cosmosAddress: '',
      cyberAddress: '',
    });
  };

  sendTransaction = async account => {
    const { web3, methods } = this.props;
    const {
      cyberAddress,
      cosmosAddress,
      nickname,
      keybaseName,
      githubUsername,
    } = this.state;

    const getData = await methods
      .believe(
        cyberAddress,
        cosmosAddress,
        nickname,
        keybaseName,
        githubUsername
      )
      .encodeABI();

    web3.eth.sendTransaction(
      {
        from: account,
        to: this.smart,
        value: 10101000000000000,
        data: getData,
      },
      hopefully(result =>
        ping(result).then(() => {
          this.setState({
            step: STAGE_CONFIRM,
            tx: result,
          });
        })
      )
    );
  };

  createTx = async () => {
    const { web3 } = this.props;
    this.setState({
      step: STAGE_SUBMITTED,
    });
    if (web3.currentProvider.host)
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          // console.log(accounts[0]);
          this.sendTransaction(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.sendTransaction(accounts[0]);
      }
    } else return console.log('Your metamask is locked!');
  };

  onClickBelieve = () => {
    this.setState({
      step: STAGE_ADD_CYBER,
    });
  };

  onClickCyber = () => {
    this.setState({
      step: STAGE_ADD_COSMOS,
    });
  };

  onClickCosmos = () => {
    this.setState({
      step: STAGE_ADD_NICKNAME,
    });
  };

  onClickNickName = () => {
    this.setState({
      step: STAGE_ADD_GIT,
    });
  };

  onClickGit = () => {
    this.setState({
      step: STAGE_ADD_KEYBASE,
    });
  };

  onClickKeyBase = () => {
    this.setState({
      step: STAGE_SING,
    });
  };

  onChangeCyberAddress = e => {
    this.setState({
      cyberAddress: e.target.value,
    });
  };

  onChangeCosmosAddress = e => {
    this.setState({
      cosmosAddress: e.target.value,
    });
  };

  onChangeNickname = e => {
    this.setState({
      nickname: e.target.value,
    });
  };

  onChangeGithubUsername = e => {
    this.setState({
      githubUsername: e.target.value,
    });
  };

  onChangeKeybaseName = e => {
    this.setState({
      keybaseName: e.target.value,
    });
  };

  render() {
    const {
      step,
      tx,
      cyberAddress,
      cosmosAddress,
      nickname,
      keybaseName,
      githubUsername,
    } = this.state;
    const { web3 } = this.props;

    if (web3.givenProvider === null)
      return (
        <ActionBar>
          <ActionBarContentText>
            <span>Please install</span>
            &nbsp;
            <a href="https://metamask.io/" target="_blank">
              Metamask and
            </a>
            &nbsp;
            <span>refresh the page</span>
          </ActionBarContentText>
        </ActionBar>
      );

    if (step === STAGE_START) {
      return (
        <ActionBar>
          <Button onClick={this.onClickBelieve}>Believe</Button>
        </ActionBar>
      );
    }

    if (step === STAGE_ADD_CYBER) {
      return (
        <ActionBar>
          <ActionBarContentText>
            input your cyber address
            <input
              value={cyberAddress}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeCyberAddress}
              placeholder="address"
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={!cyberAddress.match(PATTERN_CYBER)}
            onClick={this.onClickCyber}
          >
            confirm
          </Button>
        </ActionBar>
      );
    }

    if (step === STAGE_ADD_COSMOS) {
      return (
        <ActionBar>
          <ActionBarContentText>
            input your cosmos address for payouts
            <input
              value={cosmosAddress}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeCosmosAddress}
              placeholder="address"
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={!cosmosAddress.match(PATTERN_COSMOS)}
            onClick={this.onClickCosmos}
          >
            confirm
          </Button>
        </ActionBar>
      );
    }

    if (step === STAGE_ADD_NICKNAME) {
      return (
        <ActionBar>
          <ActionBarContentText>
            input your nickname
            <input
              value={nickname}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeNickname}
              placeholder="address"
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={nickname.length === 0}
            onClick={this.onClickNickName}
          >
            confirm
          </Button>
        </ActionBar>
      );
    }

    if (step === STAGE_ADD_GIT) {
      return (
        <ActionBar>
          <ActionBarContentText>
            input your github username
            <input
              value={githubUsername}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeGithubUsername}
              placeholder="address"
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={githubUsername.length === 0}
            onClick={this.onClickGit}
          >
            confirm
          </Button>
        </ActionBar>
      );
    }

    if (step === STAGE_ADD_KEYBASE) {
      return (
        <ActionBar>
          <ActionBarContentText>
            input your keybase name
            <input
              value={keybaseName}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeKeybaseName}
              placeholder="address"
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={keybaseName.length === 0}
            onClick={this.onClickKeyBase}
          >
            confirm
          </Button>
        </ActionBar>
      );
    }

    if (step === STAGE_SING) {
      return (
        <ActionBar>
          <ActionBarContentText>
            This transaction will call the Gods to consider you
            <LinkWindow
              style={{
                marginLeft: '5px',
              }}
              to={`https://etherscan.io/address/${this.smart}`}
            >
              as a cyber~Evangelist
            </LinkWindow>
            .
          </ActionBarContentText>
          <Button onClick={this.createTx}>create Tx</Button>
        </ActionBar>
      );
    }

    if (step === STAGE_SUBMITTED) {
      return (
        <ActionBar>
          <ActionBarContentText>
            sign the Tx
            <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (step === STAGE_CONFIRM) {
      return <Succesfuuly hash={tx} onClickBtn={this.onClickSaveAddress} />;
    }

    if (step === STAGE_THANK) {
      return <ThankSubmit />;
    }

    return null;
  }
}

export default ActionBarEvangelism;
