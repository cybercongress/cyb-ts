import React, {Component} from 'react';
import axios from 'axios'

const keypair = require('../core/keypair')
const cyberd = require('../core/builder')
const constants = require('../core/constants')

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        query: '',
        links: [{
            hash: 'QmfPt3HrNyvq8F1vYEsexY7B5ftmgZS7fraSbVkqDLH1CK'
        },
            {
                hash: 'QmZP5VsY5r2i7FekSJf6tjkByw97FusJKSQ2Y8euczfhZw'
            }]
    }

    componentWillMount() {

        const seed = "monkey wealth civil power dry powder camera silent avoid mango apology tomato clown proud since sample sing family major defy network earth absent bean"
        const addr = "cosmosaccaddr1g4jj0jvp5mp4kzvc4dfxn82gtjx5ysfpqqyamz"

        this.setState({
            query: getQueryStringValue('query')
        })

        const key = keypair.recover(seed)

        const account = new cyberd.Account(addr, constants.CyberdNetConfig.CHAIN_ID, 0, 1)
        const request = new cyberd.Request(account, "42", "0xSearch", constants.TxType.LINK)

        axios({
            method: 'post',
            url: 'http://localhost:8081/link',
            data: cyberd.builder.buildAndSignTxRequest(request, key.privateKey)
        })
            .then(data => console.log(data))
            .catch(err => console.log(err))


    }

    render() {
        return (
            <div>
                <input defaultValue={this.state.query}/>
                <a href="cyb://status">Status</a>
                <div>
                    {
                        this.state.links.map(link =>
                            <div key={link.hash}>
                                <a href={`cyb://${link.hash}.ipfs`}> {link.hash} </a>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default App;
