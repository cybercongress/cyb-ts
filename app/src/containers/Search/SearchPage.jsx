import React from 'react';
import { MainContainer } from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import BandwidthBar from './BandwidthBar';
import SearchResults from './SearchResults';
import ChainStatistic from './ChainStatistic';
import LinkResult from './LinkResult';
import searchContainer from '../searchContainer';
import chainContainer from '../chainContainer';

const SearchPage = () => (
    <Subscribe to={ [searchContainer, chainContainer] }>
        {
            (searchCon, chainCon) => {
            const { searchQuery } = searchCon.state;
            const { defaultAddress, balance } = chainCon.state;
            const isMainPage = !searchQuery;

            return (
                <MainContainer>

                    <BandwidthBar />

                    <SearchResults />

                    { isMainPage && <ChainStatistic /> }

                    { !isMainPage && defaultAddress && balance > 0 && <LinkResult /> }

                </MainContainer>
            );
        }}
    </Subscribe>
);

export default SearchPage;
