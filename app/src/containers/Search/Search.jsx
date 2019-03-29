import React from 'react';
import { MainContainer, ScrollContainer } from '@cybercongress/ui';
import { Provider, Subscribe } from 'unstated';
import SearchResults from './SearchResults';
import ChainStatistic from './ChainStatistic';
import LinkResult from './LinkResult';
import searchContainer from './searchContainer';
import statisticContainer from './statisticContainer';

class Search extends React.Component {
    componentWillMount() {
        searchContainer.init();
        statisticContainer.init();
    }

    render() {
        return (
            <Provider>
                <Subscribe to={ [searchContainer] }>
                    {
                        (searchCon) => {
                            const {
                                searchQuery, defaultAddress, balance, links,
                            } = searchCon.state;
                            const isMainPage = !searchQuery;
                            const searchResultsCount = Object.keys(links).length;

                            return (
                                <ScrollContainer>
                                    <MainContainer>

                                        { !isMainPage && searchResultsCount > 0 && (
                                            <SearchResults />
                                        ) }

                                        { isMainPage && <ChainStatistic /> }

                                        { !isMainPage && defaultAddress && balance > 0 && (
                                            <LinkResult />
                                        ) }

                                    </MainContainer>
                                </ScrollContainer>
                            );
                        }}
                </Subscribe>
            </Provider>
        );
    }
}

export default Search;
