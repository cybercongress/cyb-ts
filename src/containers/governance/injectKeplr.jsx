import React, { PureComponent } from 'react';
import { SigningCosmosClient, GasPrice } from '@cosmjs/launchpad';
import { Decimal } from '@cosmjs/math';
import { CYBER } from '../../utils/config';
import { Loading } from '../../components';

const injectKeplr = (InnerComponent) =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        keplr: null,
        accountKeplr: null,
        loading: true,
      };
      this.getWeb3 = this.getWeb3.bind(this);
    }

    componentDidMount() {
      this.getWeb3().then(() => this.setState({ loading: false }));
    }

    getWeb3 = async () => {
      try {
        if (window.getOfflineSigner) {
          const offlineSigner = window.getOfflineSigner(CYBER.CHAIN_ID);
          const accounts = await offlineSigner.getAccounts();
          const gasPrice = new GasPrice(Decimal.fromAtomics(0, 0), 'uatom');
          const gasLimits = { send: 100000 };
          const cosmJS = new SigningCosmosClient(
            CYBER.CYBER_NODE_URL_LCD,
            accounts[0].address,
            offlineSigner,
            gasPrice,
            gasLimits,
            'sync'
          );

          const address = {
            bech32: accounts[0].address,
            pubKey: accounts[0].pubkey,
          };

          this.setState({
            keplr: cosmJS,
            accountKeplr: address,
          });
        } else {
          this.setState({
            keplr: undefined,
            accountKeplr: null,
          });
        }
      } catch (e) {
        console.log('e :>> ', e);
        this.setState({ loading: false });
      }
    };

    render() {
      const { keplr, accountKeplr, loading } = this.state;

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
          keplr={keplr}
          accountKeplr={accountKeplr}
          {...this.props}
        />
      );
    }
  };

export default injectKeplr;
