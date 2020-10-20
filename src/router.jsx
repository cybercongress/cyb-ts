import React, { useEffect, useState } from 'react';
import { Route, Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { initIpfs, setIpfsStatus } from './redux/actions/ipfs';
import { setTypeDevice } from './redux/actions/settings';
import App from './containers/application/application';
import SearchResults from './containers/Search/SearchResults';
import Gift from './containers/gift';
import Funding from './containers/funding/index';
import Wallet from './containers/Wallet/Wallet';
import Brain from './containers/brain/brain';
import Home from './containers/home/home';
import Governance from './containers/governance/governance';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import Story from './containers/story/story';
import GOL from './containers/gol/gol';
import TxsDetails from './containers/txs/txsDetails';
import AccountDetails from './containers/account';
import ValidatorsDetails from './containers/validator';
import Vesting from './containers/vesting/vesting';
import Ipfs from './containers/ipfs/ipfs';
import { Dots } from './components';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import Evangelism from './containers/evangelism';
import GolDelegation from './containers/gol/pages/delegation';
import GolLifetime from './containers/gol/pages/lifetime';
import GolRelevance from './containers/gol/pages/relevance';
import GolLoad from './containers/gol/pages/load';
import Got from './containers/got/got';
import { isMobileTablet } from './utils/utils';

export const history = createBrowserHistory({});

const IPFS = require('ipfs');
const DetectRTC = require('detectrtc');

function AppRouter({
  nodeIpfs,
  initIpfsProps,
  setIpfsStatusProps,
  setTypeDeviceProps,
}) {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIpfsStatusProps(false);
    const mobile = isMobileTablet();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setTypeDeviceProps(mobile);
    //     setLoader(false);
    // //     console.log('DetectRTC.isWebRTCSupported', DetectRTC.isWebRTCSupported);
    if (!mobile) {
      if (DetectRTC.isWebRTCSupported && !isSafari) {
        await initIpfsNode();
      } else {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const initIpfsNode = async () => {
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
            Swarm: [],
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
      setLoader(false);
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
            Swarm: [],
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
      setLoader(false);
    }
  };

  if (loader) {
    return <Dots />;
  }
  return (
    <Router history={history}>
      <Route path="/" component={App} />
      <Route path="/" exact component={Home} />
      <Route exact path="/search/:query" component={SearchResults} />
      <Route path="/gift/:address?" component={Gift} />
      <Route path="/gol/takeoff" component={Funding} />
      <Route path="/tot" component={Got} />
      <Route path="/brain" component={Brain} />
      <Route exact path="/governance" component={Governance} />
      <Route path="/governance/:proposal_id" component={ProposalsDetail} />
      <Route path="/pocket" component={Wallet} />
      <Route path="/heroes" component={Validators} />
      <Route path="/episode-1" component={Story} />
      <Route exact path="/network/euler/tx" component={Txs} />
      <Route path="/gol/delegation" component={GolDelegation} />
      <Route path="/gol/lifetime" component={GolLifetime} />
      <Route path="/gol/relevance" component={GolRelevance} />
      <Route path="/gol/load" component={GolLoad} />
      <Route path="/gol" component={GOL} />
      <Route path="/network/euler/tx/:txHash" component={TxsDetails} />
      <Route
        path="/network/euler/contract/:address"
        component={AccountDetails}
      />
      <Route
        path="/network/euler/hero/:address"
        component={ValidatorsDetails}
      />
      {/* <Route path="/graph" component={ForceGraph} /> */}
      <Route path="/gol/vesting" component={Vesting} />
      <Route path="/ipfs/:cid" component={Ipfs} />
      <Route exact path="/network/euler/block" component={Block} />
      <Route path="/network/euler/block/:idBlock" component={BlockDetails} />
      <Route path="/network/euler/parameters" component={ParamNetwork} />
      <Route path="/evangelism" component={Evangelism} />
    </Router>
  );
}

const mapDispatchprops = (dispatch) => {
  return {
    initIpfsProps: (ipfsNode) => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: (status) => dispatch(setIpfsStatus(status)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
  };
};

const mapStateToProps = (store) => {
  return {
    nodeIpfs: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(AppRouter);
