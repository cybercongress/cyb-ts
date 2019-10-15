import React from "react";
import { hashHistory, IndexRoute, Route, Router, Switch } from "react-router";
import { createBrowserHistory } from "history";
import App from "./containers/application/application";
import Got from "./containers/got/got";
import Funding from "./containers/funding/index";
import Auction from "./containers/auction/index";
import NotFound from "./containers/application/notFound";

export const history = createBrowserHistory({});

const AppRouter = () => (
    <Router history={history}>
        <Route path="/" component={App} />
        <Route path="/got" component={Got} />
        <Route path="/takeoff" component={Funding} />
        <Route path="/auction" component={Auction} />

        {/* <Route path="*" exact component={NotFound} /> */}
        {/* <IndexRoute component={ Home } /> */}
        {/* </Switch> */}
    </Router>
);

export default AppRouter;
