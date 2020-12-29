
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
        console.log('window.getOfflineSigner ', window.getOfflineSigner);
        console.log('window.keplr', window.keplr);
        if (!window.getOfflineSigner || !window.keplr) {
          console.log('Please install keplr extension');
        } else if (window.keplr.experimentalSuggestChain) {
          try {
            await window.keplr.experimentalSuggestChain({
              // Chain-id of the Cosmos SDK chain.
              chainId: 'euler-6',
              // The name of the chain to be displayed to the user.
              chainName: 'euler-6',
              // RPC endpoint of the chain.
              rpc: CYBER.CYBER_NODE_URL_API,
              rest: CYBER.CYBER_NODE_URL_LCD,
              stakeCurrency: {
                coinDenom: 'EUL',
                coinMinimalDenom: 'eul',
                coinDecimals: 0,
              },
              bip44: {
                // You can only set the coin type of BIP44.
                // 'Purpose' is fixed to 44.
                coinType: 118,
              },
              bech32Config: {
                bech32PrefixAccAddr: 'cyber',
                bech32PrefixAccPub: 'cyberpub',
                bech32PrefixValAddr: 'cybervaloper',
                bech32PrefixValPub: 'cybervaloperpub',
                bech32PrefixConsAddr: 'cybervalcons',
                bech32PrefixConsPub: 'cybervalconspub',
              },
              currencies: [
                {
                  // Coin denomination to be displayed to the user.
                  coinDenom: 'EUL',
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: 'eul',
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 0,
                },
              ],
              // List of coin/tokens used as a fee token in this chain.
              feeCurrencies: [
                {
                  // Coin denomination to be displayed to the user.
                  coinDenom: 'EUL',
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: 'eul',
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 0,
                },
              ],
              coinType: 118,
              gasPriceStep: {
                low: 0,
                average: 0,
                high: 0,
              },
            });
          } catch {
            console.log('Failed to suggest the chain');
          }
        } else {
          console.log('Please use the recent version of keplr extension');
        }
        if (window.getOfflineSigner) {
          await window.keplr.enable('euler-6');
          const offlineSigner = window.getOfflineSigner('euler-6');
          const accounts = await offlineSigner.getAccounts();
          console.log('accounts', accounts);
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
