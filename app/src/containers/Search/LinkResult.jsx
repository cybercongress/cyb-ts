import React from 'react';
import {
    FlexContainer, Button, Input, LinkContainer, Text, Vitalick,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import searchContainer from '../searchContainer';

const LinkResult = () => (
    <Subscribe to={ [searchContainer] }>
        {(container) => {
            const { links, searchQuery } = container.state;
            const searchResultsCount = Object.keys(links).length;

            return (
                <span>
                    { searchResultsCount > 0 && (
                        <LinkContainer column>
                            <Text size='lg' style={ { marginBottom: '20px' } }>
                                Have your own option for&nbsp;
                                <b>
                                    {`"${searchQuery}"`}
                                </b>
                                ? Link your query and Cyb
                                will understand it!
                            </Text>
                            <FlexContainer>
                                <Input
                                  placeholder='type your link her...'
                                  inputRef={ container.cidToInput }
                                />
                                <Button
                                  color='ogange'
                                  transformtext
                                  type='button'
                                  style={ { height: '30px', marginLeft: '10px' } }
                                  onClick={ () => container.link() }
                                >
                                    Link it!
                                </Button>
                            </FlexContainer>
                        </LinkContainer>
                    )}

                    { searchResultsCount === 0 && (
                        <LinkContainer style={ { paddingTop: '100px' } } center>
                            <div style={ { width: '60%' } }>
                                <Text size='lg' style={ { marginBottom: '10px' } }>
                                    Seems that you are first one who are searching for&nbsp;
                                    <b>
                                        {`"${searchQuery}"`}
                                    </b>
                                </Text>

                                <Text size='lg' style={ { marginBottom: '20px' } }>
                                    <b>Link your query&nbsp;</b>
                                    and Cyb will understand it!
                                </Text>

                                <FlexContainer>
                                    <Input
                                      placeholder='type your link her...'
                                      inputRef={ container.cidToInput }
                                    />
                                    <Button
                                      color='greenyellow'
                                      transformtext
                                      type='button'
                                      style={ { height: '30px', marginLeft: '10px' } }
                                      onClick={ () => container.link() }
                                    >
                                        Link it!
                                    </Button>
                                </FlexContainer>
                            </div>

                            <div style={ { width: '30%' } }>
                                <Vitalick />
                            </div>
                        </LinkContainer>
                    )}
                </span>
            );
        }}
    </Subscribe>
);

export default LinkResult;
