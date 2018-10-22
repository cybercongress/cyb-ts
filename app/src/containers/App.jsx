import React, {Component} from 'react';

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        links: [],
        defaultAddress: null,
        browserSupport: false,
        searchQuery: ''
    };

    search(_query) {
        const query = _query || this.refs.searchInput.value ;

        window.cyber.search(query).then((result) => {
            console.log('result: ', result.length);
            this.setState({
                links: result
            })
        })
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
            });
            window.cyber.getDefaultAddress(address => {
                this.setState({
                    defaultAddress: address
                })
            });

            this.search(getQueryStringValue('query'));

        }
    }

    render() {
        if (!this.state.browserSupport) {
            return <div>
                Browser not supported. Download latest CYB!
            </div>
        }

        const searchResults = this.state.links.map(link =>
            <div key={link.hash}>
                <a href={`cyb://${link.hash}`}> {link.hash} </a>
            </div>
        );

        return (
            <div>
                <input defaultValue={this.state.searchQuery} ref='searchInput' onKeyPress={this._handleKeyPress}/>
                <button type="button" onClick={() => this.search()}>Search</button>

                <div>
                    <p>Search results:</p>
                    {searchResults}
                </div>

                <div>
                    <p>Default address:</p>
                    {this.state.defaultAddress || 'none'}
                </div>

                {this.state.defaultAddress &&
                    <div>
                        <p>Manual link:</p>
                        Cid To: <input ref='cidToInput'/>
                        <button type="button" onClick={() => this.link()}>Link</button>
                    </div>
                }
            </div>
        )
    }

}

export default App;
