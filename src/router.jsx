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
import Validators from './containers/Validators/Validators';
import SearchResults from './containers/Search/SearchResults';
import Story from './containers/story/story';

export const history = createHashHistory({});

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    let story = false;
    const localStorageStory = localStorage.getItem('story');
    if (localStorageStory !== null) {
      story = localStorageStory;
    }

    this.state = {
      story,
    };
  }

  render() {
    const { story } = this.state;

    if (!story) {
      history.push('/episode-1');
    }

    return (
      <Router history={history}>
        <Route path="/" component={App} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route exact path="/search/:query" component={SearchResults} />
          <Route path="/gift" component={Gift} />
          <Route path="/takeoff" component={Funding} />
          <Route path="/tot" component={Got} />
          <Route path="/auction" component={Auction} />
          <Route path="/brain" component={Search} />
          <Route exact path="/governance" component={Governance} />
          <Route path="/governance/:proposal_id" component={ProposalsDetail} />
          <Route path="/pocket" component={Wallet} />
          <Route path="/heroes" component={Validators} />
          <Route path="/episode-1" component={Story} />

          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
