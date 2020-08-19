import React from 'react';
import { Link } from 'react-router-dom';
import {
  Pane,
  TableEv as Table,
  Text,
  Tab,
  Tablist,
} from '@cybercongress/gravity';
import injectWeb3 from '../../components/web3/web3Evangelism';
import { LinkWindow, Loading } from '../../components';
import { trimString, formatNumber, fromBech32 } from '../../utils/utils';
import TableEvangelists from './table';
import InfoPane from './infoPane';
import ActionBarEvangelism from './actionBarContainer';
import {
  getSendTxToTakeoff,
  getAmountATOM,
  getTxCosmos,
  getAccountBandwidth,
  getIndexStats,
} from '../../utils/search/utils';
import { COSMOS, CYBER, DISTRIBUTION } from '../../utils/config';
import { getEstimation, cybWon, funcDiscount } from '../../utils/fundingMath';

class Evangelism extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: {},
      blessed: true,
      amount: 0,
      currentPrice: 0,
      currentDiscount: 0,
      won: 0,
      loading: true,
      addressLedger: null,
      evangelist: {
        status: '',
        nickname: '',
      },
    };
  }

  async componentDidMount() {
    const {
      contract: { events },
      web3,
    } = this.props;
    const { dataTable } = this.state;
    this.chekPathname();
    await this.checkAddressLocalStorage();
    await this.getEvangelists();
    this.getTxsCosmos();
    // if (web3.givenProvider !== null) {
    //   events.Believed(event => {
    //     console.log('Believed', event);
    //     if (event !== null) {
    //       const evetnObj = {
    //         [event.nickname]: {
    //           ...event,
    //           status: 0,
    //         },
    //       };
    //       this.setState({
    //         dataTable: { ...dataTable, ...evetnObj },
    //       });
    //     }
    //   });
    //   events.Blessed(event => {
    //     console.log('Blessed', event);
    //     dataTable[event].status = 1;
    //     this.setState({
    //       dataTable,
    //     });
    //   });
    //   events.Unblessed(event => {
    //     console.log('Unblessed', event);
    //     dataTable[event].status = 3;
    //     this.setState({
    //       dataTable,
    //     });
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
  }

  checkAddressLocalStorage = () => {
    let address = [];

    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address });
    }
  };

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    console.log(dataTx);
    if (dataTx !== null) {
      this.setState({
        dataTxs: dataTx,
      });
      await this.getStatistics(dataTx);
      await this.getGolReward();
      this.estimation();
    }
  };

  getStatistics = async data => {
    const dataTxs = data.txs;
    console.log('dataTxs', dataTxs);
    // const statisticsLocalStorage = JSON.parse(
    //   localStorage.getItem('statistics')
    // );

    let amount = 0;
    let currentDiscount = 0;
    let won = 0;
    let currentPrice = 0;
    if (dataTxs.length > 0) {
      amount = getAmountATOM(dataTxs);
    }
    // if (statisticsLocalStorage !== null) {
    //   amount += statisticsLocalStorage.amount;
    // }
    currentDiscount = funcDiscount(amount);
    won = cybWon(amount);
    currentPrice = won / amount;
    // localStorage.setItem(`statistics`, JSON.stringify(statistics));
    this.setState({
      won,
    });
  };

  getGolReward = async () => {
    const { dataTable, won } = this.state;
    const data = dataTable;
    let sumKarma = 0;
    const currentPrize = Math.floor(
      (won / DISTRIBUTION.takeoff) * DISTRIBUTION.load
    );
    const responseIndexStats = await getIndexStats();
    if (responseIndexStats !== null) {
      sumKarma = responseIndexStats.totalKarma;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        let karma = 0;
        let golRewards = 0;
        if (element.status === 1) {
          // eslint-disable-next-line no-await-in-loop
          const dataKarma = await getAccountBandwidth(element.cyberAddress);
          if (dataKarma !== null) {
            karma = dataKarma.karma;
            if (parseFloat(sumKarma) > 0) {
              golRewards =
                (parseFloat(karma) / parseFloat(sumKarma)) * currentPrize;
              element.golRewards = Math.floor(golRewards);
              element.karma = karma;
            }
          }
        }
      }
    }

    this.setState({
      dataTable: data,
    });
  };

  estimation = async () => {
    const { dataTxs, dataTable } = this.state;
    const { txs } = dataTxs;

    Object.keys(dataTable).forEach(key => {
      for (let item = 0; item < txs.length; item += 1) {
        const val =
          parseFloat(txs[item].tx.value.msg[0].value.amount[0].amount) /
          COSMOS.DIVISOR_ATOM;
        const { memo } = txs[item].tx.value;
        if (memo.length > 0) {
          if (memo.indexOf(key) !== -1) {
            dataTable[key].amount += parseFloat(val);
          }
        }
      }
    });
    this.setState({
      dataTable,
      loading: false,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/pretenders/gm) &&
      pathname.match(/pretenders/gm).length > 0
    ) {
      this.setState({ blessed: false });
    } else {
      this.setState({ blessed: true });
    }
  };

  getEvangelists = async () => {
    const { addressLedger } = this.state;
    const {
      contract: { methods },
    } = this.props;
    let evangelists = [];
    let address = '';
    if (addressLedger !== null) {
      address = addressLedger.bech32;
    }
    for (let i = 0; ; i += 1) {
      try {
        const {
          cyberAddress,
          cosmosAddress,
          ethereumAddress,
          keybase,
          github,
          status,
          nickname,
          // eslint-disable-next-line no-await-in-loop
        } = await methods.evangelists(i).call();

        if (address === cyberAddress) {
          this.setState({
            evangelist: {
              status: parseFloat(status),
              nickname,
            },
          });
        }

        evangelists = {
          ...evangelists,
          [nickname]: {
            cyberAddress,
            cosmosAddress,
            ethereumAddress,
            keybase,
            github,
            status,
            nickname,
            estimation: 0,
            amount: 0,
            karma: 0,
            golRewards: 0,
          },
        };
        this.setState({
          dataTable: evangelists,
        });
      } catch (e) {
        break;
      }
    }
  };

  render() {
    const { dataTable, blessed, loading, evangelist } = this.state;
    const {
      contract: { methods },
      web3,
    } = this.props;

    try {
      if (loading) {
        return (
          <div
            style={{
              width: '100%',
              height: '50vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Loading />
            <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
              Reward calculation
            </div>
          </div>
        );
      }

      return (
        <div>
          <main className="block-body">
            <InfoPane evangelist={evangelist} />
            <Pane
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Tablist marginBottom={24}>
                <Link to="/evangelism">
                  <Tab
                    key="Blessed"
                    id="Blessed"
                    isSelected={blessed}
                    paddingX={50}
                    paddingY={20}
                    marginX={3}
                    borderRadius={4}
                    color="#36d6ae"
                    boxShadow="0px 0px 10px #36d6ae"
                    fontSize="16px"
                  >
                    Enlightened
                  </Tab>
                </Link>
                <Link to="/evangelism/pretenders">
                  <Tab
                    key="Pretenders"
                    id="Pretenders"
                    isSelected={!blessed}
                    paddingX={50}
                    paddingY={20}
                    marginX={3}
                    borderRadius={4}
                    color="#36d6ae"
                    boxShadow="0px 0px 10px #36d6ae"
                    fontSize="16px"
                  >
                    Unawakened
                  </Tab>
                </Link>
              </Tablist>
            </Pane>
            <TableEvangelists data={dataTable} blessed={blessed} />
          </main>
          <ActionBarEvangelism web3={web3} methods={methods} />
        </div>
      );
    } catch (error) {
      return (
        <main className="block-body">
          <InfoPane />
          <div>oops...</div>
        </main>
      );
    }
  }
}

export default injectWeb3(Evangelism);
