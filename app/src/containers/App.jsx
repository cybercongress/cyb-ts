import React, {Component} from 'react';
import {
    Button,
    Title,
    PageTitle,
    MainContainer,
    PopupSkillBar,

    WideInput,
    CentredPanel,
    Section,
    SectionContent,
    FlexContainer,
    SkillBar,
    SearchItem,
    LinkContainer,
    Vitalick,
    Text,

    PopupNotification,
    PopupContent,
    ContentLineFund,
    Status,
    PopupBarFooter,
    Popup,

    IconLinks,
    IconCIDs,
    IconAccounts,
    IconBlockHeight,
    IconBlockDelay,

} from '@cybercongress/ui';
import styles from './app.less';

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        links: [],
        defaultAddress: null,
        browserSupport: false,
        searchQuery: '',
        seeAll: false,
        balance: 0,
        remained: 0,
        max_value: 0,

        successPopup: false,
        errorPopup: false,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,

        showBandwidth: false,

        blockNumber: 0,
        time: 0
    };

    getStatistics = (query) => {
        return new Promise((resolve) => {
            window.cyber.getDefaultAddress(({ address, balance, remained, max_value }) => {
                window.cyber.getStatistics().then(({ cidsCount, linksCount, accsCount, height, latest_block_time }) => {
                    const diffMSeconds = new Date().getTime() - new Date(latest_block_time).getTime() ;
                    this.setState({
                        searchQuery: query,
                        links: [],

                        remained: remained,
                        max_value, max_value,
                        defaultAddress: address,
                        balance,
                        cidsCount, linksCount, accsCount,
                        blockNumber: +height,
                        time: Math.round( diffMSeconds / 1000)
                    }, resolve)
                });
            });
        });
    }

    search(_query) {
        const query =  _query || this.searchInput.value ;

        console.log('search');
        console.log(query);
        console.log(this.searchInput.value);
        console.log(getQueryStringValue('query'));
        console.log();

        if (this.searchInput.value === getQueryStringValue('query')) {
            if (query) {
                window.cyber.search(query).then((result) => {
                    console.log('result: ', result);
                    this.setState({
                        links: result,
                        searchQuery: query
                    })
                })
            } else {
                this.getStatistics('');
            }
        } else {
            window.location = 'cyb://' + (query === '' ? '.cyber' : query);            
        }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.search();
        }
    };

    link() {
        const address = this.state.defaultAddress;
        const cidFrom = this.searchInput.value;
        const cidTo = this.cidToInput.value;
        console.log("from: " + cidFrom + " to: " + cidTo);

        window.cyber.link(cidFrom, cidTo, address)
            .then(a => {
                this.setState({
                    successPopup: true
                })
            })
            .catch(a => {
                this.setState({
                    errorPopup: true
                })
            })
    }

    componentDidMount() {
        if (!window.cyber) {
            return
        } else {

            this.setState({
                browserSupport: true,
                searchQuery: getQueryStringValue('query')
            }, () => {
                this.getStatistics('').then(() =>  this.search(getQueryStringValue('query')));
            });

            window.cyber.onNewBlock((event) => {
                console.log(event)
                this.setState({
                    blockNumber: this.state.blockNumber + 1,
                    time: 0
                })
            });

            setInterval(() => {
                this.setState({
                    time: this.state.time + 1
                })
            }, 1000)
        }
    }

    seeAll = () => {
        this.setState({
            seeAll: !this.state.seeAll
        })
    }

    openLink = (e, link) => {
        // e.preventDefault();
        const { balance, defaultAddress: address } = this.state;
        const cidFrom = this.refs.searchInput.value;
        const cidTo = link.content;
        console.log("from: " + cidFrom + " to: " + cidTo, address, balance);

        window.cyber.link(cidFrom, cidTo, address);        
    }

    close = () => {
        this.setState({
            successPopup: false,
            errorPopup: false,
        })
    }
    handleMouseEnter = () => {
        this.setState({
            showBandwidth: true
        })
    }
    handleMouseLeave = () => {
        this.setState({
            showBandwidth: false
        })
    }

    seeResults = () => {
        this.search();
        this.setState({
            successPopup: false
        })
    }
    render() {
        const {
            seeAll, balance, defaultAddress, remained, max_value, successPopup, errorPopup,
            cidsCount, linksCount, accsCount,
            showBandwidth, blockNumber, time
        } = this.state;
        if (!this.state.browserSupport) {
            return <div>
                Browser not supported. Download latest CYB!
            </div>
        }

        const { searchQuery, links } = this.state;


        const searchResults = links.slice(0, seeAll ? links.length : 10).map(link =>
            <SearchItem key={link.cid} onClick={(e) => this.openLink(e, link)} rank={link.rank}>
                {link.content}
            </SearchItem>
        );


        console.log(' defaultAddress ', this.state.defaultAddress)
        const index = searchQuery === '';

        return (
            <MainContainer>
                <FlexContainer>
                    <PageTitle>Cyberd search</PageTitle>
                    <div
                      style={ { width: '30%' } }
                      onMouseEnter={this.handleMouseEnter}
                      onMouseLeave={this.handleMouseLeave}
                    >
                        <Text style={ { paddingBottom: '10px' } }>
                            Your bandwidth:
                        </Text>
                        <SkillBar value={ remained / max_value * 100 }>
                            {showBandwidth && (
                                <PopupSkillBar>
                                    <Text color='white'>{remained} of {max_value} left ({(remained / max_value * 100).toFixed(2) }%) </Text>
                                </PopupSkillBar>
                            )}
                        </SkillBar>
                    </div>
                </FlexContainer>
                <FlexContainer>
                    <WideInput
                      defaultValue={ searchQuery }
                      inputRef={node => this.searchInput = node }
                      onKeyPress={ this._handleKeyPress }
                    />
                    <Button
                      type='button'
                      color='blue'
                      transformtext
                      style={ { height: '30px', marginLeft: '10px' } }
                      onClick={() => this.search()}
                    >
                        search
                    </Button>
                </FlexContainer>
                {links.length > 0 && (
                    <div>
                        <Title style={ { marginLeft: '0px', marginBottom: '0px' } }>
                            Search results:
                        </Title>
                        <LinkContainer column>
                            {searchResults}
                        </LinkContainer>
                        {links.length > 10 && (
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
                                <CentredPanel style={{justifyContent: 'space-evenly'}}>
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
                                <CentredPanel style={{justifyContent: 'space-evenly'}}>
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
                                <CentredPanel style={{justifyContent: 'space-evenly'}}>
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
                                <CentredPanel style={{justifyContent: 'space-evenly'}}>
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
                                <CentredPanel style={{justifyContent: 'space-evenly'}}>
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

                {defaultAddress && balance > 0 && searchQuery && links.length > 0 && (
                    <LinkContainer column>
                        <Text size='lg' style={ { marginBottom: '20px' } }>
                            Have your own option for
                            <b>
                                "
                                {searchQuery}
                                "
                            </b>
                            ? Link your query and Cyb
                            will understand it!
                        </Text>
                        <FlexContainer>
                            <WideInput placeholder='type your link her...' inputRef={node => { this.cidToInput = node; }} />
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

                {defaultAddress && balance > 0 && searchQuery && links.length === 0 && (
                    <LinkContainer style={ { paddingTop: '100px' } } center>
                        <div style={ { width: '60%' } }>
                            <Text size='lg' style={ { marginBottom: '10px' } }>
                                Seems that you are first one who are searching for
                                <b>
                                    "
                                    {searchQuery}
                                    "
                                </b>
                            </Text>

                            <Text size='lg' style={ { marginBottom: '20px' } }>
                                <b>Link your query</b>
                                and Cyb will understand it!
                            </Text>

                            <FlexContainer>
                                <WideInput placeholder='type your link her...' inputRef={node => { this.cidToInput = node; }} />
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

                
                {successPopup && (
        <Popup type='notification' open={true} onClose={this.close}>
            <PopupContent>
                <ContentLineFund>
                    <Status type='successfully'>Successfully linked</Status>
                </ContentLineFund>
            </PopupContent>
            <PopupBarFooter>
                <Button onClick={this.seeResults} transparent='true' style={ { color: '#4a90e2', marginRight: '10px' } }>
                    see results
                </Button>
            </PopupBarFooter>
        </Popup>

                )}

    {errorPopup && (
        <Popup open={true} type='notification-error' onClose={this.close}>
            <Status type='error'>Link error</Status>
        </Popup>
    )}

            </MainContainer>            
        )
    }
}

export default App;
