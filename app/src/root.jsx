import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './containers/App/App';
import Stake from './containers/Stake/Stake';

const Root = () => (
    <Router>
        <div>
            <Route exact path="/" component={ App } />
            <Route path="/stake" component={ Stake } />
        </div>
    </Router>
);

export default Root;
