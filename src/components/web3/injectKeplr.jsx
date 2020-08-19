import React, { PureComponent } from 'react';
import { CYBER } from '../../utils/config';
import { Loading } from '../index';

const { GaiaApi } = require('@chainapsis/cosmosjs/gaia/api');
const {
  defaultBech32Config,
} = require('@chainapsis/cosmosjs/core/bech32Config');

const injectKeplr = InnerComponent =>
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

    checkAddress = async cosmosJS => {
      try {
        const account = {
          bech32: '',
          pubKey: [],
        };

        const address = await cosmosJS.getKeys();

        account.bech32 = address[0].bech32Address;
        account.pubKey = address[0].pubKey;

        return account;
      } catch (error) {
        console.log('error :>> ', error);
        return null;
      }
    };

    getWeb3 = async () => {
      try {
        if (window.cosmosJSWalletProvider) {
          const cosmosJS = new GaiaApi(
            {
              chainId: CYBER.CHAIN_ID,
              walletProvider: window.cosmosJSWalletProvider,
              rpc: CYBER.CYBER_NODE_URL_API,
              rest: CYBER.CYBER_NODE_URL_LCD,
            },
            {
              bech32Config: defaultBech32Config('cyber'),
            }
          );

          const address = await this.checkAddress(cosmosJS);

          if (address === null) {
            this.setState({
              keplr: cosmosJS,
              accountKeplr: null,
            });
          } else {
            this.setState({
              keplr: cosmosJS,
              accountKeplr: address,
            });
          }
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
