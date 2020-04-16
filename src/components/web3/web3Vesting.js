import React, { PureComponent } from 'react';
import { ActionBar } from '@cybercongress/gravity';
import waitForWeb3 from './waitForWeb3';

import abiToken from '../../../contracts/Token';
import VestingConstract from '../../../contracts/Vesting.json';
import TokenManager from '../../../contracts/TokenManager.json';

import { Loading, ActionBarContentText } from '../index';
import NotFound from '../../containers/application/notFound';

import { AUCTION, NETWORKSIDS } from '../../utils/config';

const injectWeb3Vesting = InnerComponent =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        contractVesting: null,
        loading: true,
        accounts: null,
        networkId: null,
        buyTransactionSuccess: false,
        isCorrectNetwork: true,
        contractTokenManager: null,
        contractToken: null,
        addMetamask: false,
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smartVesting = AUCTION.ADDR_VESTING;
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
      // this.checkBuy();
    }

    getWeb3 = async () => {
      try {
        const web3 = await waitForWeb3();
        if (web3.givenProvider !== null) {
          await window.ethereum.enable();

          console.log(web3.givenProvider);
          const networkId = await web3.eth.net.getId();
          const networkContract = NETWORKSIDS.main;

          if (networkContract !== networkId) {
            return this.setState({
              isCorrectNetwork: false,
            });
          }

          const contractVesting = await new web3.eth.Contract(
            VestingConstract.abi,
            this.smartVesting
          );

          const tokenManagerAddress = await contractVesting.methods
            .tokenManager()
            .call();

          const contractTokenManager = await new web3.eth.Contract(
            TokenManager.abi,
            tokenManagerAddress
          );

          const tokenAddress = await contractTokenManager.methods
            .token()
            .call();

          const contractToken = await new web3.eth.Contract(
            abiToken,
            tokenAddress
          );

          const accounts = await web3.eth.getAccounts();

          this.setState({
            web3,
            contractVesting,
            contractTokenManager,
            contractToken,
            accounts: accounts[0].toLowerCase(),
            networkId,
            isCorrectNetwork: true,
            addMetamask: false,
          });
        } else {
          this.setState({
            addMetamask: true,
            loading: false,
          });
        }
      } catch (e) {
        this.setState({ loading: false });
      }
    };

    render() {
      const {
        web3,
        loading,
        accounts,
        isCorrectNetwork,
        contractVesting,
        contractTokenManager,
        contractToken,
        addMetamask,
      } = this.state;

      if (!isCorrectNetwork) {
        return (
          <NotFound text="Please connect to the Ethereum Rinkeby Network" />
        );
      }

      if (loading) {
        return (
          <div
            style={{
              width: '100%',
              height: '50vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loading />
          </div>
        );
      }

      if (addMetamask) {
        return (
          <div>
            <main className="block-body">
              <NotFound text=" " />
            </main>
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
          </div>
        );
      }

      return (
        <InnerComponent
          web3={web3}
          accounts={accounts}
          contractVesting={contractVesting}
          contractTokenManager={contractTokenManager}
          contractToken={contractToken}
          {...this.props}
        />
      );
    }
  };

export default injectWeb3Vesting;
