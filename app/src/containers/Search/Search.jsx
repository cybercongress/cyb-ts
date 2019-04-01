import React from 'react';
import { MainContainer, ScrollContainer } from '@cybercongress/ui';
import { Provider, Subscribe } from 'unstated';
import SearchResults from './SearchResults';
import ChainStatistic from './ChainStatistic';
import searchContainer from './searchContainer';
import statisticContainer from './statisticContainer';
import { LinkBarContainer, LinkNewAnswerBar, LinkQuestionWithAnswerBar } from './LinkBar';

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
                            const canLink = defaultAddress && balance > 0;

                            return (
                                <span>
                                    <ScrollContainer style={ { height: 'calc(100vh - 64px)' } }>
                                        <MainContainer>

                                            { !isMainPage && searchResultsCount > 0 && (
                                                <SearchResults />
                                            ) }

                                            { isMainPage && <ChainStatistic /> }

                                        </MainContainer>
                                    </ScrollContainer>
                                    <LinkBarContainer>
                                        { !isMainPage && canLink && searchResultsCount > 0
                                            && (<LinkNewAnswerBar />)
                                        }
                                        { isMainPage && canLink
                                            && (<LinkQuestionWithAnswerBar />)
                                        }
                                    </LinkBarContainer>
                                </span>
                            );
                        }}
                </Subscribe>
            </Provider>
        );
    }
}

export default Search;
