import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Search from './containers/Search/Search';
import Validators from './containers/Validators/Validators';
import Lottery from './containers/Lottery/Lottery';
import './root.css';

const Root = () => (
    <Router>
        <span>
            <Route exact path='/' component={ Search } />
            <Route path='/lottery' component={ Lottery } />
            <Route path='/validators' component={ Validators } />
        </span>
    </Router>
);

export default Root;
