import React, { useEffect, useState } from 'react';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
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
import { Dots, Timer } from './components';
import { initIpfs, setIpfsStatus, setIpfsID } from './redux/actions/ipfs';
import { setBlock } from './redux/actions/block';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import Evangelism from './containers/evangelism';
import Got from './containers/got/got';
import TrollBoxx from './containers/trollBox';
import useIpfsStart from './ipfsHook';
import ForceGraph from './containers/forceGraph/forceGraph';
import ForceQuitter from './containers/forceGraph/forceQuitter';
import PortPages from './containers/port';
import TestKeplr from './containers/testKeplre';
import Mint from './containers/mint';
import RoutedEnergy from './containers/energy';
import Bootcycle from './containers/bootcycle';
import Market from './containers/market';
import Oracle from './containers/oracle';
import Objects from './containers/Objects';
import Taverna from './containers/taverna';
import Teleport from './containers/teleport';
import Nebula from './containers/nebula';
import Genesis from './containers/genesis';
import Movie from './containers/movie';
import PortalCitizenship from './containers/portal';
import PortalGift from './containers/portal/gift';

import useIpfsFactory from './useIpfsFactory';

import { TIME_START, CYBER } from './utils/config';

export const history = createBrowserHistory({});

function AppRouter({
  initIpfsProps,
  setIpfsStatusProps,
  setTypeDeviceProps,
  setIpfsIDProps,
}) {
  const dataIpfsStart = useIpfsStart();
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState(false);
  const [genesis, setGenesis] = useState(false);
  const [baseUrl, setBaseUrl] = useState(true);
  const [wsClient, setWsClient] = useState(null);

  // Qmdab25Rt2irn9aEQCVCJUCSB9aabit7cwghNgYJhiKeth

  useEffect(() => {
    initIpfsProps(dataIpfsStart.node);
    setIpfsStatusProps(dataIpfsStart.status);
    setTypeDeviceProps(dataIpfsStart.mobile);
    setIpfsIDProps(dataIpfsStart.id);
    // tryConnectToPeer(dataIpfsStart.node);
  }, [dataIpfsStart]);

  return (
    <Router history={history}>
      <Route path="/" component={App} />
      <Switch>
        <Route path="/" exact component={Wallet} />
        <Route path="/bootloader" component={Home} />
        <Route exact path="/search/:query" component={SearchResults} />
        {/* <Route path="/gift/:address?" component={Gift} /> */}
        <Route path="/gol/takeoff" component={Funding} />
        <Route path="/tot" component={Got} />
        {/* <Route path="/brain" component={Brain} /> */}
        <Route exact path="/senate" component={Governance} />
        <Route path="/senate/:proposalId" component={ProposalsDetail} />
        <Route path="/halloffame" component={Validators} />
        <Route path="/episode-1" component={Story} />
        <Route exact path="/network/bostrom/tx" component={Txs} />
        <Route path="/gol" component={GOL} />
        <Route path="/network/bostrom/tx/:txHash" component={TxsDetails} />
        <Route
          path="/network/bostrom/contract/:address"
          component={AccountDetails}
        />
        <Route
          path="/network/bostrom/hero/:address"
          component={ValidatorsDetails}
        />
        <Route path="/quitter" component={ForceQuitter} />
        <Route path="/graph" component={ForceGraph} />
        <Route path="/pgraph/:agent" component={ForceGraph} />
        <Route path="/gol/vesting" component={Vesting} />
        <Route path="/ipfs/:cid" component={Ipfs} />
        <Route exact path="/network/bostrom/block" component={Block} />
        <Route
          path="/network/bostrom/block/:idBlock"
          component={BlockDetails}
        />
        <Route path="/network/bostrom/parameters" component={ParamNetwork} />
        <Route path="/evangelism" component={Evangelism} />
        <Route path="/degenbox" component={TrollBoxx} />
        <Route path="/portal" component={PortPages} />
        <Route path="/test" component={TestKeplr} />
        <Route path="/mint" component={Mint} />
        <Route path="/grid" component={RoutedEnergy} />
        {/* <Route path="/bootcycle" component={Bootcycle} /> */}
        <Route path="/token" component={Market} />
        <Route path="/oracle" component={Oracle} />
        <Route path="/particles" component={Objects} />
        <Route path="/sixthSense" component={Taverna} />
        <Route path="/teleport" component={Teleport} />
        <Route path="/nebula" component={Nebula} />
        {/* <Route path="/genesis" component={Genesis} /> */}
        <Route path="/genesis" component={Movie} />
        <Route path="/portalCitizenship" component={PortalCitizenship} />
        <Route path="/portalGift" component={PortalGift} />
      </Switch>
    </Router>
  );
}

const mapDispatchprops = (dispatch) => {
  return {
    initIpfsProps: (ipfsNode) => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: (status) => dispatch(setIpfsStatus(status)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
    setIpfsIDProps: (id) => dispatch(setIpfsID(id)),
  };
};

export default connect(null, mapDispatchprops)(AppRouter);
