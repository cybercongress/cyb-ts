import React from 'react';
import {
    Button, SearchItem, Heading, Pane,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import searchContainer from './searchContainer';

const SearchResults = () => (
    <Subscribe to={ [searchContainer] }>
        {(container) => {
            const {
                seeAll, searchQuery, links,
            } = container.state;

            const searchResultsCount = Object.keys(links).length;
            const resultsLimit = (seeAll || searchResultsCount < 10) ? searchResultsCount : 10;
            const cids = Object.keys(links);
            const searchItems = [];

            for (let index = 0; index < resultsLimit; index += 1) {
                const cid = cids[index];
                const loaded = links[cid].status === 'success';

                const item = (
                    <SearchItem
                      key={ cid }
                      hash={ cid }
                      rank={ links[cid].rank }
                      rankGrade={ getRankGrade(links[cid].rank) }
                      status={ links[cid].status }
                      onClick={ e => container.openLink(e, links[cid].content) }
                    >
                        { loaded ? links[cid].content : cid}
                    </SearchItem>
                );

                searchItems.push(item);
            }

            return (
                <div>
                    <Heading size={ 600 } color='#7c7c7c' marginBottom={ 24 }>
                        {`The answer for ${searchQuery} is`}
                    </Heading>
                    <Pane>
                        {searchItems}
                    </Pane>
                    {searchResultsCount > 10 && (
                        <Pane display='flex' justifyContent='center'>
                            <Button
                              fontSize='1em'
                              marginY={ 15 }
                              className='btn'
                              onClick={ () => container.seeAll() }
                            >
                                {!seeAll ? 'see all' : 'top 10'}
                            </Button>
                        </Pane>
                    )}
                </div>
            );
        }}
    </Subscribe>
);

const getRankGrade = (rank) => {
    let from;
    let to;
    let grade;

    switch (rank) {
    case (rank > 0.01 && rank <= 1):
        from = 0.01;
        to = 1;
        grade = 1;
        break;
    case (rank > 0.001 && rank <= 0.01):
        from = 0.001;
        to = 0.01;
        grade = 2;
        break;
    case (rank > 0.000001 && rank <= 0.001):
        from = 0.000001;
        to = 0.001;
        grade = 3;
        break;
    case (rank > 0.0000000001 && rank <= 0.000001):
        from = 0.0000000001;
        to = 0.000001;
        grade = 4;
        break;
    case (rank > 0.000000000000001 && rank <= 0.0000000001):
        from = 0.000000000000001;
        to = 0.0000000001;
        grade = 5;
        break;
    case (rank > 0.0000000000000000001 && rank <= 0.000000000000001):
        from = 0.0000000000000000001;
        to = 0.000000000000001;
        grade = 6;
        break;
    case (rank > 0 && rank <= 0.0000000000000000001):
        from = 0;
        to = 0.0000000000000000001;
        grade = 7;
        break;
    default:
        break;
    }

    return {
        from,
        to,
        grade,
    };
};

export default SearchResults;
