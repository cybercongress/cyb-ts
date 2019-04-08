import React from 'react';
import { Pane, Vitalick, Text } from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import searchContainer from './searchContainer';

const NoResults = () => (
    <Subscribe to={ [searchContainer] }>
        {(container) => {
            const { searchQuery } = container.state;

            return (
                <Pane display='flex' justifyContent='space-around' paddingTop='5%'>
                    <Pane>
                        <Vitalick />
                    </Pane>
                    <Pane
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      flexDirection='column'
                    >
                        <Pane width={ 323 } textAlign='center' marginBottom={ 25 }>
                            <Text size={ 600 } color='#fff'>
                                You are the first one who are searching for
                                <b>
                                    &nbsp;
                                    {searchQuery}
                                    &nbsp;
                                </b>
                            </Text>
                        </Pane>
                        <Pane width={ 323 } textAlign='center'>
                            <Text size={ 600 } color='#fff'>
                                Cyber your query and Cyb will understand it!
                            </Text>
                        </Pane>
                    </Pane>
                </Pane>
            );
        }}
    </Subscribe>
);

export default NoResults;
