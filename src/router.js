import React from 'react';
import { hashHistory, IndexRoute, Route, Router, Switch } from 'react-router';
import { createHashHistory } from 'history';
import App from './containers/application/application';
import Got from './containers/got/got';
import Funding from './containers/funding/index';
import Auction from './containers/auction/index';
import NotFound from './containers/application/notFound';
import Search from './containers/Search/Search';
import Lottery from './containers/Lottery/Lottery';
import Home from './containers/home/home';
import Wallet from './containers/Wallet/Wallet';
import Governance from './containers/governance/governance';
import Gift from './containers/gift/gift';
import ProposalsDetail from './containers/governance/proposalsDetail';

export const history = createHashHistory({});

const AppRouter = () => (
  <Router history={history}>
    <Route path="/" component={App} />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/gift" component={Gift} />
      <Route path="/takeoff" component={Funding} />
      <Route path="/tot" component={Got} />
      <Route path="/auction" component={Auction} />
      <Route path="/brain" component={Search} />
      <Route exact path="/governance" component={Governance} />
      <Route path="/governance/:proposal_id" component={ProposalsDetail} />
      <Route path="/wallet" component={Wallet} />

      <Route exact path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
