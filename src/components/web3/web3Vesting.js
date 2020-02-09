import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';

import Token from '../../../contracts/Token.json';
import Auction from '../../../contracts/Auction.json';
import VestingConstract from '../../../contracts/Vesting.json';
import TokenManager from '../../../contracts/TokenManager.json';

import { Loading } from '../index';
import NotFound from '../../containers/application/notFound';

import { AUCTION } from '../../utils/config';

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
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smartVesting = AUCTION.ADDR_VESTING;
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
      // this.checkBuy();
    }

    async getWeb3() {
      await window.ethereum.enable();
      try {
        const web3 = await waitForWeb3();

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

        const tokenAddress = await contractTokenManager.methods.token().call();

        const contractToken = await new web3.eth.Contract(
          Token.abi,
          tokenAddress
        );
        if (web3.givenProvider === null) {
          this.setState({
            web3,
            contractVesting,
            contractTokenManager,
            contractToken,
            accounts: null,
            networkId: null,
            isCorrectNetwork: true,
          });
        } else {
          const networkContract = Object.keys(Auction.networks);
          const networkId = await web3.eth.net.getId();
          const accounts = await web3.eth.getAccounts();

          this.setState({
            web3,
            contractVesting,
            contractTokenManager,
            contractToken,
            accounts: accounts[0].toLowerCase(),
            networkId,
            isCorrectNetwork: networkContract.indexOf(`${networkId}`) !== -1,
          });
        }
      } catch (e) {
        this.setState({ loading: false });
      }
    }

    render() {
      const {
        web3,
        loading,
        accounts,
        isCorrectNetwork,
        contractVesting,
        contractTokenManager,
        contractToken,
      } = this.state;
      // if (!isCorrectNetwork) {
      //   return (
      //     <NotFound text="Please connect to the Ethereum Rinkeby Network" />
      //   );
      // }
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
