import React, { Suspense, useEffect, useState } from 'react';
import { Route, Router, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { setTypeDevice } from './redux/actions/settings';
import App from './containers/application/application';


const SearchResults = React.lazy(() => import('./containers/Search/SearchResults'));
const Gift = React.lazy(() => import('./containers/gift'));
const Funding = React.lazy(() => import('./containers/funding/index'));
const Wallet = React.lazy(() => import('./containers/Wallet/Wallet'));
const Brain = React.lazy(() => import('./containers/brain/brain'));
const Home = React.lazy(() => import('./containers/home/home'));
const Governance = React.lazy(() => import('./containers/governance/governance'));
const ProposalsDetail = React.lazy(() => import('./containers/governance/proposalsDetail'));
const Validators = React.lazy(() => import('./containers/Validators/Validators'));
const Story = React.lazy(() => import('./containers/story/story'));
const GOL = React.lazy(() => import('./containers/gol/gol'));
const TxsDetails = React.lazy(() => import('./containers/txs/txsDetails'));
const AccountDetails = React.lazy(() => import('./containers/account'));

const ValidatorsDetails = React.lazy(() => import('./containers/validator'));
const Vesting = React.lazy(() => import('./containers/vesting/vesting'));


const Ipfs = React.lazy(() => import('./containers/ipfs/ipfs'));

import { Dots, Timer } from './components';
import { initIpfs, setIpfsStatus, setIpfsID } from './redux/actions/ipfs';
import { setBlock } from './redux/actions/block';

const BlockDetails  = React.lazy(() => import('./containers/blok/blockDetails'));
const Txs  = React.lazy(() => import('./containers/txs'));
const Block  = React.lazy(() => import('./containers/blok'));
const ParamNetwork  = React.lazy(() => import('./containers/parameters'));
const Evangelism  = React.lazy(() => import('./containers/evangelism'));
const Got  = React.lazy(() => import('./containers/got/got'));
const TrollBoxx  = React.lazy(() => import('./containers/trollBox'));

import useIpfsStart from './ipfsHook';



const TestKeplr = React.lazy(() => import('./containers/testKeplre'));
const ForceGraph = React.lazy(() => import('./containers/forceGraph/forceGraph'));
const ForceQuitter = React.lazy(() => import('./containers/forceGraph/forceQuitter'));
const PortPages = React.lazy(() => import('./containers/port'));

const Mint = React.lazy(() => import('./containers/mint'));
const RoutedEnergy  = React.lazy(() => import('./containers/energy'));
const Bootcycle  = React.lazy(() => import('./containers/bootcycle'));

const Market  = React.lazy(() => import('./containers/market'));
const Oracle  = React.lazy(() => import('./containers/oracle'));
const Objects  = React.lazy(() => import('./containers/Objects'));
const Taverna  = React.lazy(() => import('./containers/taverna'));
const Teleport  = React.lazy(() => import('./containers/teleport'));
const Nebula  = React.lazy(() => import('./containers/nebula'));
const Genesis  = React.lazy(() => import('./containers/genesis'));
const Movie  = React.lazy(() => import('./containers/movie'));
const PortalCitizenship  = React.lazy(() => import('./containers/portal'));
const PortalGift  = React.lazy(() => import('./containers/gift'));

const Release  = React.lazy(() => import('./containers/portal/release'));
const Ibc  = React.lazy(() => import('./containers/ibc'));

const {Codes,
  CodePage,
  ContractPage,
  DashboardPage}  = React.lazy(() => import('./containers/wasm'));

// import {
//   Codes,
//   CodePage,
//   ContractPage,
//   DashboardPage,
// } from './containers/wasm';


const Help  = React.lazy(() => import('./containers/help'));
const Assets  = React.lazy(() => import('./containers/assets'));
const MainPartal  = React.lazy(() => import('./containers/portal/mainPortal'));

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
      <Suspense fallback={<div>Loading...</div>}>
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
        {/* <Route path="/portal" component={PortPages} /> */}
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
        <Route path="/citizenship" component={PortalCitizenship} />
        <Route path="/gift" component={PortalGift} />
        <Route path="/release" component={Release} />
        <Route path="/portal" component={MainPartal} />
        <Route path="/ibc" component={Ibc} />
        {/* wasm */}
        <Route path="/codes" exact component={Codes} />
        <Route path="/codes/:codeId" component={CodePage} />
        <Route exact path="/contracts" component={DashboardPage} />
        <Route path="/contracts/:contractAddress" component={ContractPage} />

        <Route path="/help" component={Help} />
        <Route path="/assets" component={Assets} />
      </Switch>
      </Suspense>
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
