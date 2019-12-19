import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';
import { abi } from '../../utils/abi';
import Auction from '../../../contracts/Auction.json';
import AuctionUtils from '../../../contracts/AuctionUtils.json';
import Token from '../../../contracts/Token.json';

import { Loading } from '../index';
import NotFound from '../../containers/application/notFound';

import { AUCTION } from '../../utils/config';

const {
  ADDR_SMART_CONTRACT,
  ADDR_SMART_CONTRACT_AUCTION_UTILS,
  ADDR_TOKEN,
} = AUCTION;

const injectWeb3 = InnerComponent =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        contract: null,
        loading: true,
        accounts: null,
        networkId: null,
        buyTransactionSuccess: false,
        isCorrectNetwork: true,
        contractAuctionUtils: null,
        contractToken: null,
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smart = ADDR_SMART_CONTRACT;
      this.smartAuctionUtils = ADDR_SMART_CONTRACT_AUCTION_UTILS;
      this.tokenAdrrs = ADDR_TOKEN;
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
      // this.checkBuy();
    }

    async getWeb3() {
      try {
        const web3 = await waitForWeb3();
        console.log('web3.givenProvider', web3);
        const contract = await new web3.eth.Contract(abi, this.smart);
        const contractAuctionUtils = await new web3.eth.Contract(
          AuctionUtils.abi,
          this.smartAuctionUtils
        );
        const contractToken = await new web3.eth.Contract(
          Token.abi,
          this.tokenAdrrs
        );

        if (web3.givenProvider === null) {
          this.setState({
            web3,
            contract,
            contractAuctionUtils,
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
            contract,
            contractAuctionUtils,
            contractToken,
            accounts: accounts[0],
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
        contract,
        loading,
        accounts,
        contractAuctionUtils,
        isCorrectNetwork,
        buyTransactionSuccess,
        contractToken,
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

      return (
        <InnerComponent
          web3={web3}
          contract={contract}
          accounts={accounts}
          contractAuctionUtils={contractAuctionUtils}
          buyTransactionSuccess={buyTransactionSuccess}
          contractToken={contractToken}
          {...this.props}
        />
      );
    }
  };

export default injectWeb3;
