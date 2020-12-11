import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';
import abiEvangelism from '../../../contracts/Evangelism';
import { Loading } from '../index';
import NotFound from '../../containers/application/notFound';

import { AUCTION, NETWORKSIDS } from '../../utils/config';

const { ADDR_EVANGELISM } = AUCTION;

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
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smart = ADDR_EVANGELISM;
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
      // this.checkBuy();
    }

    getWeb3 = async () => {
      try {
        const web3 = await waitForWeb3();
        const networkId = await web3.eth.net.getId();
        const networkContract = NETWORKSIDS.main;

        if (networkContract !== networkId) {
          return this.setState({
            isCorrectNetwork: false,
          });
        }
        const contract = await new web3.eth.Contract(abiEvangelism, this.smart);

        if (web3.givenProvider === null) {
          return this.setState({
            web3,
            contract,
            accounts: null,
            networkId: null,
            isCorrectNetwork: true,
          });
        }

        const accounts = await web3.eth.getAccounts();
        return this.setState({
          web3,
          contract,
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
        isCorrectNetwork,
        buyTransactionSuccess,
      } = this.state;
      if (!isCorrectNetwork) {
        return (
          <NotFound text="Please connect to the Ethereum Network" />
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
          buyTransactionSuccess={buyTransactionSuccess}
          {...this.props}
        />
      );
    }
  };

export default injectWeb3;
