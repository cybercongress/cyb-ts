import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { Link } from 'react-router-dom';
import App from './containers/application/application';
import SearchResults from './containers/Search/SearchResults';
import Wallet from './containers/Wallet/Wallet';
import Home from './containers/home/home';
import Governance from './containers/governance/governance';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import Story from './containers/story/story';
import TxsDetails from './containers/txs/txsDetails';
import AccountDetails from './containers/account';
import ValidatorsDetails from './containers/validator';
import Ipfs from './containers/ipfs/ipfs';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import TrollBoxx from './containers/trollBox';
import ForceGraph from './containers/forceGraph/forceGraph';
import ForceQuitter from './containers/forceGraph/forceQuitter';
import TestKeplr from './containers/testKeplre';
import Mint from './containers/mint';
import RoutedEnergy from './containers/energy';
import Market from './containers/market';
import Oracle from './containers/oracle';
import Objects from './containers/Objects';
import Taverna from './containers/taverna';
import Teleport from './containers/teleport';
import Nebula from './containers/nebula';
import Movie from './containers/movie';
import PortalCitizenship from './containers/portal';
import PortalGift from './containers/portal/gift';
import Release from './containers/portal/release';
import Temple from './containers/temple';

import Ibc from './containers/ibc';
import {
  Codes,
  CodePage,
  ContractPage,
  DashboardPage,
} from './containers/wasm';
import Help from './containers/help';
import Assets from './containers/assets';
import MainPartal from './containers/portal/mainPortal';
import {
  ListNetwork,
  CustomNetwork,
  DetailsNetwork,
} from './containers/network';

import Sigma from './containers/sigma';

import ipfsSettings from './containers/ipfsSettings';
import { routes } from './routes';

export const history = createBrowserHistory({});

// backward compatibility
const oldLinks = {
  halloffame: '/halloffame',
  halloffameJailed: '/halloffame/jailed',
  mint: '/mint',
};

const pageNotExist = () => (
  <div>
    page not exists
    <br />
    <Link to={routes.home.path}>Home</Link>
  </div>
);

function AppRouter() {
  return (
    <Router history={history}>
      <Route path={routes.home.path} component={() => <App />} />
      <Switch>
        <Route path="/" exact component={Temple} />
        <Route path="/robot" component={Wallet} />
        <Route path="/oracle" component={Home} />
        <Route exact path="/search/:query" component={SearchResults} />
        <Route exact path="/senate" component={Governance} />
        <Route path="/senate/:proposalId" component={ProposalsDetail} />

        <Redirect
          from={oldLinks.halloffameJailed}
          to={routes.sphereJailed.path}
        />
        <Redirect from={oldLinks.halloffame} to={routes.sphere.path} />

        <Route path={routes.sphere.path} component={Validators} />
        <Route path="/episode-1" component={Story} />
        <Route exact path="/network/bostrom/tx" component={Txs} />
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
        <Route exact path="/ipfs" component={ipfsSettings} />
        <Route path="/ipfs/:cid" component={Ipfs} />
        <Route exact path="/network/bostrom/blocks" component={Block} />
        <Route
          path="/network/bostrom/blocks/:idBlock"
          component={BlockDetails}
        />
        <Route path="/network/bostrom/parameters" component={ParamNetwork} />
        <Route path="/degenbox" component={TrollBoxx} />
        {/* <Route path="/portal" component={PortPages} /> */}
        <Route path="/test" component={TestKeplr} />

        <Redirect from={oldLinks.mint} to={routes.hfr.path} />
        <Route path={routes.hfr.path} component={Mint} />

        <Route path="/grid" component={RoutedEnergy} />
        <Route path="/token" component={Market} />
        <Route path="/oracle" component={Oracle} />
        <Route path="/particles" component={Objects} />
        <Route path="/sixthSense" component={Taverna} />

        <Route path="/teleport" component={Teleport} />
        <Route path="/warp" component={Teleport} />
        {/* <Route path="/genesis" component={Genesis} /> */}
        <Route path="/genesis" component={Movie} />
        <Route path="/citizenship" component={PortalCitizenship} />
        <Route path="/gift" component={PortalGift} />
        <Route path="/release" component={Release} />
        <Route path="/portal" component={MainPartal} />
        <Route path="/ibc" component={Ibc} />
        {/* wasm */}
        <Route path="/libs" exact component={Codes} />
        <Route path="/libs/:codeId" component={CodePage} />
        <Route exact path="/contracts" component={DashboardPage} />
        <Route path="/contracts/:contractAddress" component={ContractPage} />
        {/* network */}
        <Route path="/networks" exact component={ListNetwork} />
        <Route path="/networks/add" component={CustomNetwork} />
        <Route path="/networks/:networkId" component={DetailsNetwork} />

        <Route path="/help" component={Help} />
        <Route path="/assets" component={Assets} />
        {/* Sigma */}
        <Route path="/sigma" component={Sigma} />
        <Route path="/nebula" component={Nebula} />
        {/* <Route path="/" component={Temple} /> */}

        <Route path="*" component={pageNotExist} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
