import React, { PureComponent } from 'react';
import abiAuction from '../../../contracts/Auction';
import abiAuctionUtils from '../../../contracts/AuctionUtils';
import abiToken from '../../../contracts/Token';
import { Loading } from '../../components';
import NotFound from '../application/notFound';
import Web3 from 'web3';

import { AUCTION, NETWORKSIDS } from '../../utils/config';

const { ADDR_SMART_CONTRACT } = AUCTION;

let web3js;

const resolveWeb3 = async resolve => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  web3js = new Web3();
  web3js.setProvider(
    new web3js.providers.HttpProvider(AUCTION.HTTP_PROVIDER_URL)
  );

  resolve(web3js);
};

const waitForWeb3 = () =>
  new Promise(resolve => {
    // If our web3js already exists, resolve immediately
    if (web3js) return resolve(web3js);

    // If an instance of web3 exist in window, resolve immediately
    if (window.web3 || window.ethereum) return resolveWeb3(resolve);

    // If window is already full loaded, resolve immediately
    if (window.document.readyState === 'complete') {
      return resolveWeb3(resolve);
    }
    // Wait until window has fully loaded to resolve web3
    window.addEventListener('load', () => resolveWeb3(resolve));
  });

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
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
      // this.checkBuy();
    }

    getWeb3 = async () => {
      try {
        const web3 = await waitForWeb3();
        console.log(web3);
        const networkId = await web3.eth.net.getId();
        const networkContract = NETWORKSIDS.main;

        if (networkContract !== networkId) {
          return this.setState({
            isCorrectNetwork: false,
          });
        }
        const contract = await new web3.eth.Contract(abiAuction, this.smart);

        const addrAuctionUtils = await contract.methods.utils().call();
        console.log(addrAuctionUtils);
        const contractAuctionUtils = await new web3.eth.Contract(
          abiAuctionUtils,
          addrAuctionUtils
        );

        const addrToken = await contract.methods.token().call();

        const contractToken = await new web3.eth.Contract(abiToken, addrToken);

        if (web3.givenProvider === null) {
          return this.setState({
            web3,
            contract,
            contractAuctionUtils,
            contractToken,
            accounts: null,
            networkId: null,
            isCorrectNetwork: true,
          });
        }

        const accounts = await web3.eth.getAccounts();
        return this.setState({
          web3,
          contract,
          contractAuctionUtils,
          contractToken,
          accounts: accounts[0],
          networkId,
          isCorrectNetwork: true,
        });
      } catch (e) {
        this.setState({ loading: false });
      }
    };

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
