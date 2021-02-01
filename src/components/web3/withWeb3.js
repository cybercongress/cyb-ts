import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';
import abiAuction from '../../../contracts/Auction';
import abiAuctionUtils from '../../../contracts/AuctionUtils';
import abiToken from '../../../contracts/Token';
import abiVesting from '../../../contracts/Vesting';
import TokenManager from '../../../contracts/TokenManager.json';

import { Loading } from '../index';
import NotFound from '../../containers/application/notFound';

import { AUCTION, NETWORKSIDS } from '../../utils/config';

const { ADDR_SMART_CONTRACT } = AUCTION;

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
        contractVesting: null,
        contractTokenManager: null,
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smart = ADDR_SMART_CONTRACT;
      this.smartVesting = AUCTION.ADDR_VESTING;
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
        const networkContract = NETWORKSIDS.rinkeby;

        if (networkContract !== networkId) {
          return this.setState({
            isCorrectNetwork: false,
          });
        }
        // const contract = await new web3.eth.Contract(abiAuction, this.smart);

        // const addrAuctionUtils = await contract.methods.utils().call();

        // const contractAuctionUtils = await new web3.eth.Contract(
        //   abiAuctionUtils,
        //   addrAuctionUtils
        // );

        // const contractVesting = await new web3.eth.Contract(
        //   abiVesting,
        //   this.smartVesting
        // );

        // const tokenManagerAddress = await contractVesting.methods
        //   .tokenManager()
        //   .call();

        // const contractTokenManager = await new web3.eth.Contract(
        //   TokenManager.abi,
        //   tokenManagerAddress
        // );

        // const tokenAddress = await contractTokenManager.methods.token().call();

        // const contractToken = await new web3.eth.Contract(
        //   abiToken,
        //   tokenAddress
        // );

        if (web3.givenProvider === null) {
          return this.setState({
            web3,
            // contract,
            // contractAuctionUtils,
            // contractTokenManager,
            // contractVesting,
            // contractToken,
            accounts: null,
            networkId: null,
            isCorrectNetwork: true,
          });
        }

        const accounts = await web3.eth.getAccounts();
        return this.setState({
          web3,
          // contract,
          // contractAuctionUtils,
          // contractTokenManager,
          // contractVesting,
          // contractToken,
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
        contractVesting,
        contractTokenManager,
      } = this.state;
      if (!isCorrectNetwork) {
        return <NotFound text="Please connect to the Ethereum Network" />;
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
          contractVesting={contractVesting}
          contractTokenManager={contractTokenManager}
          {...this.props}
        />
      );
    }
  };

export default injectWeb3;
