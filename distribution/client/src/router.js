import React from "react";
import { hashHistory, IndexRoute, Route, Router, Switch } from "react-router";
import { createHashHistory } from "history";
import App from "./containers/application/application";
import Got from "./containers/got/got";
import Funding from "./containers/funding/index";
import Auction from "./containers/auction/index";
import NotFound from "./containers/application/notFound";
import Search from "./containers/Search/Search";
import Lottery from "./containers/Lottery/Lottery";
import Home from "./containers/home/home";

export const history = createHashHistory({});

const AppRouter = () => (
    <Router history={history}>
        <Route path="/" component={App} />
        <Route path="/" exact component={Home} />
        <Route path="/got" component={Got} />
        <Route path="/takeoff" component={Funding} />
        <Route path="/auction" component={Auction} />
        <Route path="/search" component={ Search } />
        <Route path="/lottery" component={ Lottery } />

        {/* <Route exact path="*" component={NotFound} /> */}
        {/* </Switch> */}
    </Router>
);

export default AppRouter;
