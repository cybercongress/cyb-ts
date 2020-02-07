import React from 'react';
import { hashHistory, IndexRoute, Route, Router, Switch } from 'react-router';
import { createHashHistory } from 'history';
import App from './containers/application/application';
import Got from './containers/got/got';
import Funding from './containers/funding/index';
import Auction from './containers/auction/index';
import NotFound from './containers/application/notFound';
import Brain from './containers/brain/brain';
import Home from './containers/home/home';
import Wallet from './containers/Wallet/Wallet';
import Governance from './containers/governance/governance';
import Gift from './containers/gift/gift';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import SearchResults from './containers/Search/SearchResults';
import Story from './containers/story/story';
import GOL from './containers/gol/gol';
import Vesting from './containers/vesting/vesting';

export const history = createHashHistory({});

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  funcUpdateValueSearchInput = query => {
    this.setState({
      query,
    });
  };

  render() {
    const { query } = this.state;

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
          <Route path="/gift" component={Gift} />
          <Route path="/takeoff" component={Funding} />
          <Route path="/tot" component={Got} />
          <Route path="/auction" component={Auction} />
          <Route path="/brain" component={Brain} />
          <Route exact path="/governance" component={Governance} />
          <Route path="/governance/:proposal_id" component={ProposalsDetail} />
          <Route path="/pocket" component={Wallet} />
          <Route path="/heroes" component={Validators} />
          <Route path="/episode-1" component={Story} />
          <Route path="/gol" component={GOL} />
          <Route path="/vesting" component={Vesting} />

          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
