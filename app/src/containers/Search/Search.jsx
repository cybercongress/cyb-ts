import React from 'react';
import { MainContainer } from '@cybercongress/ui';
import { Provider, Subscribe } from 'unstated';
import BandwidthBar from './BandwidthBar';
import SearchResults from './SearchResults';
import ChainStatistic from './ChainStatistic';
import LinkResult from './LinkResult';
import searchContainer from '../searchContainer';
import statisticContainer from '../statisticContainer';

class Search extends React.Component {
    componentWillMount() {
        searchContainer.init();
        statisticContainer.init();

        searchContainer.querySubscribe(statisticContainer.onQueryUpdate);
    }

    render() {
        return (
            <Provider>
                <Subscribe to={ [searchContainer] }>
                    {
                        (searchCon) => {
                            const { searchQuery, defaultAddress, balance } = searchCon.state;
                            const isMainPage = !searchQuery;

                            return (
                                <MainContainer>

                                    <BandwidthBar />

                                    <SearchResults />

                                    { isMainPage && <ChainStatistic /> }

                                    { !isMainPage && defaultAddress && balance > 0 && (
                                        <LinkResult />
                                    ) }

                                </MainContainer>
                            );
                        }}
                </Subscribe>
            </Provider>
        );
    }
}

export default Search;
