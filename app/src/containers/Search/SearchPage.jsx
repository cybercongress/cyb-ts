import React from 'react';
import { MainContainer } from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import BandwidthBar from './BandwidthBar';
import SearchResults from './SearchResults';
import ChainStatistic from './ChainStatistic';
import LinkResult from './LinkResult';
import searchContainer from '../searchContainer';
import chainContainer from '../chainContainer';
import Validators from './Validators';

const SearchPage = () => (
    <Subscribe to={
        [searchContainer, chainContainer]
    }>
        {
            (searchCon, chainCon) => {
            const { searchQuery } = searchCon.state;
            const { defaultAddress, balance, validators } = chainCon.state;
            const isMainPage = !searchQuery;

                console.log('searchQuery: ', searchQuery);
                console.log('!searchQuery: ', !searchQuery);
                console.log('is main page: ', isMainPage);
            return (
                <MainContainer>

                    <BandwidthBar />

                    <SearchResults />

                    { isMainPage && <ChainStatistic /> }

                    { !isMainPage && defaultAddress && balance > 0 && <LinkResult /> }

                    { isMainPage && <Validators validators={ validators } /> }

                </MainContainer>
            );
        }}
    </Subscribe>
);

export default SearchPage;
