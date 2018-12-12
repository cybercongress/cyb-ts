import React, {Component} from 'react';
import {Button, Title} from '@cybercongress/ui';
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
        balance: 0
    };

    search(_query) {
        const query =  _query || this.refs.searchInput.value ;

        console.log('search');
        console.log(query);
        console.log(this.refs.searchInput.value);
        console.log(getQueryStringValue('query'));
        console.log();

        // if (this.refs.searchInput.value === getQueryStringValue('query')) {
            window.cyber.search(query).then((result) => {
                console.log('result: ', result);
                this.setState({
                    links: result,
                    searchQuery: query
                })
            })
        // } else {
        //     window.location = 'cyb://' + query;            
        // }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.search();
        }
    };

    link() {
        const address = this.state.defaultAddress;
        const cidFrom = this.refs.searchInput.value;
        const cidTo = this.refs.cidToInput.value;
        console.log("from: " + cidFrom + " to: " + cidTo);

        window.cyber.link(cidFrom, cidTo, address);
    }

    componentDidMount() {
        if (!window.cyber) {
            return
        } else {

            this.setState({
                browserSupport: true,
                searchQuery: getQueryStringValue('query')
            }, () => {
                window.cyber.getDefaultAddress(({ address, balance }) => {
                    this.setState({
                        defaultAddress: address,
                        balance
                    })
                    this.search(getQueryStringValue('query'));
                });
            });
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

    render() {
        const { seeAll, balance, defaultAddress } = this.state;
        if (!this.state.browserSupport) {
            return <div>
                Browser not supported. Download latest CYB!
            </div>
        }

        const { searchQuery, links } = this.state;

        const searchResults = links.slice(0, seeAll ? links.length : 10).map(link =>
            <div key={link.hash} className={styles.searchItem}>
                <a onClick={(e) => this.openLink(e, link)} href={`cyb://${link.content}`}> {link.content} </a><span>{link.Rank}</span>
            </div>
        );


        console.log(' defaultAddress ', this.state.defaultAddress)

        return (
            <div className={styles.searchContainer}>
                <Title>/Cyberd search</Title>
                <input className={styles.input} defaultValue={searchQuery} ref='searchInput' onKeyPress={this._handleKeyPress}/>
                <button className={styles.button} type="button" onClick={() => this.search()}>search</button>

                {links.length > 0 && <div>
                    <h3 className={styles.title}>Search results:</h3>
                    {searchResults}
                    {links.length > 10 &&  <button className={styles.button} type="button" onClick={() => this.seeAll()}>{!seeAll ? 'see all' : 'top 10'}</button>}
                </div>}


                {(defaultAddress && (balance > 0) && searchQuery && links.length > 0) &&
                    <div className={styles.linkContainer}>
                        <p>Have your own option for <b>"{searchQuery}"</b>? Link your query and Cyb will understand it!</p>
                        <input placeholder='type your link her...' className={styles.input} ref='cidToInput'/>
                        <button className={styles.button + ' ' + styles.yellow} type="button" onClick={() => this.link()}>Link it!</button>
                    </div>
                }

                {(defaultAddress && (balance > 0) && searchQuery && links.length === 0) &&
                    <div className={styles.linkContainer}>
                        <img className={styles.vitalick }  src={require('./buterin-02.svg')} alt='vitalick'/>
                        <p className={styles.notFoundFirstLine}>Seems that you are first one who are searching for <b>"{searchQuery}"</b></p>
                        <p><b>Link your query</b> and Cyb will understand it!</p>
                        <input placeholder='type your link her...' className={styles.input+ ' ' + styles.noResult} ref='cidToInput'/>
                        <button className={styles.button+ ' ' + styles.green} type="button" onClick={() => this.link()}>Link it!</button>
                    </div>
                }
            </div>
        )
    }

}

export default App;
