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
import { trimString, formatNumber, getDelegator } from '../../utils/utils';
import TableEvangelists from './table';
import InfoPane from './infoPane';
import ActionBarEvangelism from './actionBarContainer';
import {
  getSendTxToTakeoff,
  getAmountATOM,
  getTxCosmos,
} from '../../utils/search/utils';
import { COSMOS, CYBER } from '../../utils/config';
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
      loading: true,
    };
  }

  async componentDidMount() {
    const {
      contract: { events },
    } = this.props;
    const { dataTable } = this.state;
    this.chekPathname();
    await this.getEvangelists();
    this.getTxsCosmos();

    events.Believed(event => {
      console.log('Believed', event);
      if (event !== null) {
        const evetnObj = {
          [event.nickname]: {
            ...event,
            status: 0,
          },
        };
        this.setState({
          dataTable: { ...dataTable, ...evetnObj },
        });
      }
    });

    events.Blessed(event => {
      console.log('Blessed', event);
      dataTable[event].status = 1;
      this.setState({
        dataTable,
      });
    });

    events.Unblessed(event => {
      console.log('Unblessed', event);
      dataTable[event].status = 3;
      this.setState({
        dataTable,
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
  }

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    console.log(dataTx);
    if (dataTx !== null) {
      this.setState({
        dataTxs: dataTx,
      });
      await this.getStatistics(dataTx);
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
      amount,
      currentPrice,
      currentDiscount,
    });
  };

  estimation = () => {
    const {
      dataTxs,
      dataTable,
      currentPrice,
      currentDiscount,
      amount,
    } = this.state;
    const { txs } = dataTxs;

    let temp = 0;
    for (let item = 0; item < txs.length; item += 1) {
      let estimation = 0;
      const val =
        parseFloat(txs[item].tx.value.msg[0].value.amount[0].amount) /
        COSMOS.DIVISOR_ATOM;
      const addressFrom = txs[item].tx.value.msg[0].value.from_address;
      const tempCyberAdd = getDelegator(
        addressFrom,
        CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
      );
      const tempVal = temp + val;
      estimation =
        getEstimation(currentPrice, currentDiscount, amount, tempVal) -
        getEstimation(currentPrice, currentDiscount, amount, temp);
      temp += val;

      if (dataTable[tempCyberAdd]) {
        dataTable[tempCyberAdd].estimation += parseFloat(estimation);
        dataTable[tempCyberAdd].amount += parseFloat(val);
      }
    }
    this.setState({
      dataTable,
      loading: false,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/not/gm) && pathname.match(/not/gm).length > 0) {
      this.setState({ blessed: false });
    } else {
      this.setState({ blessed: true });
    }
  };

  getEvangelists = async () => {
    const {
      contract: { methods },
    } = this.props;
    let evangelists = [];
    for (let i = 0; ; i += 1) {
      try {
        let amount = 0;
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

        // eslint-disable-next-line no-await-in-loop
        // const tx = await getSendTxToTakeoff(cosmosAddress, COSMOS.ADDR_FUNDING);
        // if (tx.length > 0) {
        //   amount = getAmountATOM(tx);
        // }
        evangelists = {
          ...evangelists,
          [cyberAddress]: {
            cyberAddress,
            cosmosAddress,
            ethereumAddress,
            keybase,
            github,
            status,
            nickname,
            estimation: 0,
            amount: 0,
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
    const { dataTable, blessed, loading } = this.state;
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
            <InfoPane />
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
                    Blessed
                  </Tab>
                </Link>
                <Link to="/evangelism/not">
                  <Tab
                    key="Not"
                    id="Not"
                    isSelected={!blessed}
                    paddingX={50}
                    paddingY={20}
                    marginX={3}
                    borderRadius={4}
                    color="#36d6ae"
                    boxShadow="0px 0px 10px #36d6ae"
                    fontSize="16px"
                  >
                    Not
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
