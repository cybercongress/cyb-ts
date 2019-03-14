import React, { Component } from 'react';
import { Provider } from 'unstated';
import SearchPage from './SearchPage';
import searchContainer from '../searchContainer';
import chainContainer from '../chainContainer';

class Search extends Component {
    componentWillMount() {
        searchContainer.init();
        chainContainer.init();
    }

    render() {
        return (
            <Provider>
                <SearchPage />
            </Provider>
        );
    }
}

export default Search;
