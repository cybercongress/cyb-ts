import React, { Component } from 'react';
import {
    Button,
    Title,
    PageTitle,
    MainContainer,
    PopupSkillBar,

    Input,
    CentredPanel,
    Section,
    SectionContent,
    FlexContainer,
    SkillBar,
    SearchItem,
    LinkContainer,
    Vitalick,
    Text,
    Message,

    IconLinks,
    IconCIDs,
    IconAccounts,
    IconBlockHeight,
    IconBlockDelay,
} from '@cybercongress/ui';
import Validators from '../Validators/Validators';
import { getContentByCid, initIpfs } from '../../utils';

const APP_NAME = '.cyber';

class App extends Component {
    state = {
        links: {},
        defaultAddress: null,
        browserSupport: false,
        searchQuery: '',
        seeAll: false,
        balance: 0,
        bwRemained: 0,
        bwMaxValue: 0,

        successLinkMessage: false,
        errorLinkMessage: false,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,

        showBandwidth: false,

        blockNumber: 0,
        time: 0,

        validators: [],
    };

    constructor(props) {
        super(props);

        initIpfs();
    }

    componentDidMount() {
        if (!window.cyber) {
            return;
        }

        window.cyb.getQuery()
            .then((query) => {
                this.setState({
                    browserSupport: true,
                    searchQuery: query,
                }, () => {
                    this.getStatistics()
                        .then(() => this.search(query));
                });
            });

        window.cyb.onQueryUpdate((query) => {
            this.searchInput.value = query;
            this.search(query);
        });

        window.cyber.onNewBlock((event) => {
            console.log(event);
            this.setState({
                blockNumber: this.state.blockNumber + 1,
                time: 0,
            });
        });

        setInterval(() => {
            this.setState({
                time: this.state.time + 1,
            });
        }, 1000);
    }

    getSearchResults = (links, count) => {
        const cids = Object.keys(links);
        const searchItems = [];

        if (cids.length === 0) {
            return [];
        }

        for (let index = 0; index < count; index += 1) {
            const cid = cids[index];
            const disabled = links[cid].status !== 'success';

            const item = disabled ? (
                <SearchItem
                  key={ cid }
                  rank={ links[cid].rank }
                  disabled
                >
                    {cid} ({links[cid].status})
                </SearchItem>
            ) : (
                <SearchItem
                  key={ cid }
                  rank={ links[cid].rank }
                  onClick={ e => this.openLink(e, links[cid].content) }
                >
                    {links[cid].content}
                </SearchItem>
            );

            searchItems.push(item);
        }

        return searchItems;
    };

    search(_query) {
        this.closeMessages();

        const query = _query || this.searchInput.value;

        window.cyb.setQuery(query);

        console.log('cyb defaultAddress: ', this.state.defaultAddress);
        console.log('search query: ', query);

        if (query) {
            window.cyber.searchCids(query).then((result) => {
                console.log('Result cids: ', result);

                const links = result.reduce((obj, link) => ({
                    ...obj,
                    [link.cid]: {
                        rank: link.rank,
                        status: 'loading',
                    },
                }), {});

                this.setState({
                    links,
                    searchQuery: query,
                });

                this.loadContent(links);
            });

            this.link(APP_NAME, query);
        } else {
            this.getStatistics();
        }
    }

    link(from, to) {
        const address = this.state.defaultAddress;
        const cidFrom = from || this.searchInput.value;
        const cidTo = to || this.cidToInput.value;

        window.cyber.link(cidFrom, cidTo, address)
            .then((result) => {
                console.log(`Linked ${cidFrom} with ${cidTo}. Results: ${result}`);

                const links = {
                    ...this.state.links,
                    newLink: {
                        rank: 'n/a',
                        status: 'success',
                        content: cidTo,
                    },
                };

                this.setState({
                    successLinkMessage: true,
                    links,
                });
            })
            .catch((error) => {
                console.log(`Cant link ${cidFrom} with ${cidTo}. Error: ${error}`);

                this.setState({
                    errorLinkMessage: true,
                });
            });
    }

    getStatistics = () => new Promise((resolve) => {
        window.cyber.getDefaultAddress(({
            address, balance, remained, max_value,
        }) => {
            window.cyber.getStatistics()
                .then(({
                    cidsCount, linksCount, accsCount, height, latest_block_time,
                }) => {
                    const diffMSeconds = new Date().getTime() - new Date(latest_block_time).getTime();

                    window.cyber.getValidators()
                        .then((validators) => {
                            this.setState({
                                validators,

                                bwRemained: remained,
                                bwMaxValue: max_value,
                                defaultAddress: address,
                                balance,
                                cidsCount, linksCount, accsCount,
                                blockNumber: +height,
                                time: Math.round(diffMSeconds / 1000),
                            }, resolve);
                        });
                });
        });
    });

    async loadContent(cids) {
        const contentPromises = Object.keys(cids).map(cid => getContentByCid(cid, 5000)
            .then((content) => {
                const { links } = this.state;

                links[cid] = {
                    ...links[cid],
                    status: 'success',
                    content,
                };

                this.setState({
                    links,
                });
            })
            .catch((error) => {
                const { links } = this.state;

                links[cid] = {
                    ...links[cid],
                    status: 'error',
                };

                this.setState({
                    links,
                });
            }));

        Promise.all(contentPromises);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            window.cyb.setQuery(this.searchInput.value);
            this.search();
        }
    };

    seeAll = () => {
        this.setState({
            seeAll: !this.state.seeAll,
        });
    }

    openLink = (e, content) => {
        // e.preventDefault();
        const { balance, defaultAddress: address } = this.state;
        const cidFrom = this.searchInput.value;
        const cidTo = content;

        console.log(`from: ${cidFrom} to: ${cidTo}. address: ${address}. balance: ${balance}`);

        window.cyber.link(cidFrom, cidTo, address);
    }

    closeMessages = () => {
        this.setState({
            successLinkMessage: false,
            errorLinkMessage: false,
        });
    }

    handleMouseEnter = () => {
        this.setState({
            showBandwidth: true,
        });
    }

    handleMouseLeave = () => {
        this.setState({
            showBandwidth: false,
        });
    }

    render() {
        if (!this.state.browserSupport) {
            return (
                <div>
                    Browser not supported. Download latest CYB!
                </div>
            );
        }

        const {
            seeAll, balance, defaultAddress, bwRemained, bwMaxValue, successLinkMessage,
            errorLinkMessage, cidsCount, linksCount, accsCount, showBandwidth, blockNumber,
            time, validators, searchQuery, links,
        } = this.state;

        const searchResultsCount = Object.keys(links).length;
        const resultsLimit = (seeAll || searchResultsCount < 10) ? searchResultsCount : 10;

        const searchResults = this.getSearchResults(links, resultsLimit);

        const index = searchQuery === '';

        return (
            <MainContainer>
                <FlexContainer>
                    <PageTitle>Cyberd search</PageTitle>
                    {defaultAddress && (
                        <div
                          style={ { width: '30%' } }
                          onMouseEnter={ this.handleMouseEnter }
                          onMouseLeave={ this.handleMouseLeave }
                        >
                            <Text style={ { paddingBottom: '10px' } }>
                                Your bandwidth:
                            </Text>
                            <SkillBar value={ bwRemained / bwMaxValue * 100 }>
                                {showBandwidth && (
                                <PopupSkillBar>
                                    <Text color='white'>
                                        {bwRemained} of {bwMaxValue} left
                                        ({(bwRemained / bwMaxValue * 100).toFixed(2) }%)
                                    </Text>
                                </PopupSkillBar>
                                )}
                            </SkillBar>
                        </div>
                    )}
                </FlexContainer>
                <FlexContainer>
                    <Input
                      defaultValue={ searchQuery }
                      inputRef={ node => this.searchInput = node }
                      onKeyPress={ this._handleKeyPress }
                    />
                    <Button
                      type='button'
                      color='blue'
                      transformtext
                      style={ { height: '30px', marginLeft: '10px' } }
                      onClick={ () => this.search() }
                    >
                        search
                    </Button>
                </FlexContainer>
                {searchResultsCount > 0 && (
                    <div>
                        <Title style={ { marginLeft: '0px', marginBottom: '0px' } }>
                            Search results:
                        </Title>
                        { successLinkMessage
                            && (
                            <Message type='success'>
                                Link successfully added
                            </Message>
)
                        }
                        { errorLinkMessage
                            && (
                            <Message type='error'>
                                Error adding link
                            </Message>
)
                        }
                        <LinkContainer column>
                            {searchResults}
                        </LinkContainer>
                        {searchResultsCount > 10 && (
                            <Button
                              color='blue'
                              style={ { marginLeft: '0px' } }
                              transformtext
                              type='button'
                              onClick={ () => this.seeAll() }
                            >
                                {!seeAll ? 'see all' : 'top 10'}
                            </Button>
                        )}
                    </div>
                )}

                {index && (
                    <div>

                        <Title style={ { marginLeft: '0px', marginBottom: '30px', textAlign: 'center' } }>
                            Search statistic:
                        </Title>
                        <Section noMargin noWrap>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                    <IconLinks />
                                    <Text uppercase color='blue'>
                                        link
                                    </Text>
                                    <Text
                                      color='blue'
                                      size='xlg'
                                    >
                                        {linksCount}
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                    <IconCIDs />
                                    <Text uppercase color='blue'>
                                        CIDs
                                    </Text>
                                    <Text
                                      color='blue'
                                      size='xlg'
                                    >
                                        {cidsCount}
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                    <IconAccounts />
                                    <Text uppercase color='blue'>
                                        accounts
                                    </Text>
                                    <Text
                                      color='blue'
                                      size='xlg'
                                    >
                                        {accsCount}
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                    <IconBlockHeight />
                                    <Text uppercase color='blue'>
                                        last block height
                                    </Text>
                                    <Text
                                      color='blue'
                                      size='xlg'
                                    >
                                        {blockNumber}
                                    </Text>

                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '23%' } }>
                                <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                    <IconBlockDelay />
                                    <Text uppercase color='blue'>
                                        last block delay
                                    </Text>
                                    <Text
                                      color='blue'
                                      size='xlg'
                                    >
                                        {time} sec
                                    </Text>

                                </CentredPanel>
                            </SectionContent>
                        </Section>
                    </div>
                )}

                {defaultAddress && balance > 0 && searchQuery && searchResultsCount > 0 && (
                    <LinkContainer column>
                        <Text size='lg' style={ { marginBottom: '20px' } }>
                            Have your own option for&nbsp;
                            <b>
                                "{searchQuery}"
                            </b>
                            ? Link your query and Cyb
                            will understand it!
                        </Text>
                        <FlexContainer>
                            <Input
                              placeholder='type your link her...'
                              inputRef={ (node) => { this.cidToInput = node; } }
                            />
                            <Button
                              color='ogange'
                              transformtext
                              type='button'
                              style={ { height: '30px', marginLeft: '10px' } }
                              onClick={ () => this.link() }
                            >
                                Link it!
                            </Button>
                        </FlexContainer>
                    </LinkContainer>
                )}

                {defaultAddress && balance > 0 && searchQuery && searchResultsCount === 0 && (
                    <LinkContainer style={ { paddingTop: '100px' } } center>
                        <div style={ { width: '60%' } }>
                            <Text size='lg' style={ { marginBottom: '10px' } }>
                                Seems that you are first one who are searching for&nbsp;
                                <b>
                                    "{searchQuery}"
                                </b>
                            </Text>

                            <Text size='lg' style={ { marginBottom: '20px' } }>
                                <b>Link your query&nbsp;</b>
                                and Cyb will understand it!
                            </Text>

                            <FlexContainer>
                                <Input
                                  placeholder='type your link her...'
                                  inputRef={ (node) => { this.cidToInput = node; } }
                                />
                                <Button
                                  color='greenyellow'
                                  transformtext
                                  type='button'
                                  style={ { height: '30px', marginLeft: '10px' } }
                                  onClick={ () => this.link() }
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

                { index && <Validators validators={ validators } /> }
            </MainContainer>
        );
    }
}

export default App;
