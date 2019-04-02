import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Stake from './containers/Stake/Stake';
import Search from './containers/Search/Search';
import Validators from './containers/Validators/Validators';
import Lottery from './containers/Lottery/Lottery';

const Root = () => (
    <Router>
        <span>
            <Route exact path='/' component={ Search } />
            <Route path='/lottery' component={ Lottery } />
            <Route path='/validators' component={ Validators } />
            <Route path='/stake' component={ Stake } />
        </span>
    </Router>
);

export default Root;
