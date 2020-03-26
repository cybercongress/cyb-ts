import React from 'react';
import { hashHistory, IndexRoute, Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import App from './containers/application/application';
import Got from './containers/got/got';
import Funding from './containers/funding/index';
import Auction from './containers/auction/index';
import NotFound from './containers/application/notFound';
import Brain from './containers/brain/brain';
import Home from './containers/home/home';
import Wallet from './containers/Wallet/Wallet';
import Governance from './containers/governance/governance';
import Gift from './containers/gift';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import SearchResults from './containers/Search/SearchResults';
import Story from './containers/story/story';
import GOL from './containers/gol/gol';
import TxsDetails from './containers/txs/txsDetails';
import AccountDetails from './containers/account';
import ValidatorsDetails from './containers/validator';
import Vesting from './containers/vesting/vesting';
import Snap from './containers/snap';
import Ipfs from './containers/ipfs/ipfs';
import { Dots } from './components';
import { initIpfs, setIpfsStatus } from './redux/actions/ipfs';
import Block from './containers/blok';
import GolDelegation from './containers/gol/pages/delegation';
import GolLifetime from './containers/gol/pages/lifetime';
import GolRelevance from './containers/gol/pages/relevance';
import GolLoad from './containers/gol/pages/load';

const IPFS = require('ipfs');

export const history = createBrowserHistory({});

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      ipfs: null,
      loader: true,
    };
  }

  async componentDidMount() {
    const { setIpfsStatusProps } = this.props;
    setIpfsStatusProps(false);
    // this.setState({
    //   loader: false,
    // });
   // await this.initIpfsNode();
    const mobile = this.isMobileTablet();
    if (!mobile) {
      await this.initIpfsNode();
    } else {
      this.setState({ loader: false });
    }
  }

  isMobileTablet = () => {
    let check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      ) {
        check = true;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  funcUpdateValueSearchInput = query => {
    this.setState({
      query,
    });
  };

  initIpfsNode = async () => {
    const { initIpfsProps, setIpfsStatusProps } = this.props;
    try {
      const node = await IPFS.create({
        repo: 'ipfs-repo-cyber',
        init: false,
        start: true,
        relay: {
          enabled: true,
          hop: {
            enabled: true,
          },
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
              '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
            ],
          },
          Bootstrap: [
            '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
            '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
            '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
            '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
            '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
            '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
          ],
        },
      });
      console.log('node init false', node);
      initIpfsProps(node);
      if (node !== null) {
        const status = await node.isOnline();
        setIpfsStatusProps(status);
      }
      this.setState({ loader: false });
    } catch (error) {
      console.log(error);
      const node = await IPFS.create({
        repo: 'ipfs-repo-cyber',
        init: true,
        start: true,
        relay: {
          enabled: true,
          hop: {
            enabled: true,
          },
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
              '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
            ],
          },
          Bootstrap: [
            '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
            '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
            '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
            '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
            '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
            '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
          ],
        },
      });
      console.log('node init true', node);
      initIpfsProps(node);
      if (node !== null) {
        const status = await node.isOnline();
        setIpfsStatusProps(status);
      }
      this.setState({ loader: false });
    }
  };

  render() {
    const { query, loader } = this.state;

    if (loader) {
      return <Dots />;
    }

    return (
      <Router history={history}>
        <Route
          path="/"
          render={props => (
            <App
              funcUpdate={this.funcUpdateValueSearchInput}
              query={query}
              {...props}
            />
          )}
          // component={App}
        />
        <Switch>
          <Route
            path="/"
            exact
            render={props => (
              <Home funcUpdate={this.funcUpdateValueSearchInput} {...props} />
            )}
            // component={Home}
          />
          <Route exact path="/search/:query" component={SearchResults} />
          <Route path="/gift/:address?" component={Gift} />
          <Route path="/takeoff" component={Funding} />
          <Route path="/tot" component={Got} />
          <Route path="/auction" component={Auction} />
          <Route path="/brain" component={Brain} />
          <Route exact path="/governance" component={Governance} />
          <Route path="/governance/:proposal_id" component={ProposalsDetail} />
          <Route path="/pocket" component={Wallet} />
          <Route path="/heroes" component={Validators} />
          <Route path="/episode-1" component={Story} />
          <Route exact path="/gol" component={GOL} />
          <Route path="/gol/delegation" component={GolDelegation} />
          <Route path="/gol/lifetime" component={GolLifetime} />
          <Route path="/gol/relevance" component={GolRelevance} />
          <Route path="/gol/load" component={GolLoad} />
          <Route path="/network/euler-5/tx/:txHash" component={TxsDetails} />
          <Route
            path="/network/euler-5/contract/:address"
            component={AccountDetails}
          />
          <Route
            path="/network/euler-5/hero/:address"
            component={ValidatorsDetails}
          />
          <Route path="/vesting" component={Vesting} />
          <Route path="/snap" component={Snap} />
          <Route path="/ipfs" component={Ipfs} />
          <Route path="/network/euler-5/block/:idBlock" component={Block} />

          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

const mapDispatchprops = dispatch => {
  return {
    initIpfsProps: ipfsNode => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: status => dispatch(setIpfsStatus(status)),
  };
};

export default connect(null, mapDispatchprops)(AppRouter);
