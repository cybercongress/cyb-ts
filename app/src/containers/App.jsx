import React, {Component} from 'react';
import axios from 'axios'

const keypair = require('../core/keypair')
const cyberd = require('../core/builder')
const constants = require('../core/constants')

const nodeUrl = 'http://localhost:8081'

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        query: '',
        cidFrom: '',
        cidTo: '',
        links: [
            {hash: 'QmfPt3HrNyvq8F1vYEsexY7B5ftmgZS7fraSbVkqDLH1CK'},
            {hash: 'QmZP5VsY5r2i7FekSJf6tjkByw97FusJKSQ2Y8euczfhZw'}
        ]
    }

    search() {
        const cid = this.state.query
        console.log(cid)
        axios({
            method: 'get',
            url: nodeUrl + '/search?cid=' + cid,
        })
            .then(data => {
                let cids = data.data.result.cids
                let links = []
                for (let i = 0; i < cids.length; i++) {

                    links.push({hash: cids[i].Cid})
                }

                this.setState({
                    links: links
                })
            })
            .catch(err => console.log(err))
    }

    linkTest() {
        const cidFrom = this.state.cidFrom
        const cidTo = this.state.cidTo
        console.log(cidFrom + " " + cidTo)

        const seed = "monkey wealth civil power dry powder camera silent avoid mango apology tomato clown proud since sample sing family major defy network earth absent bean"
        const addr = "cosmosaccaddr1g4jj0jvp5mp4kzvc4dfxn82gtjx5ysfpqqyamz"

        const key = keypair.recover(seed)

        this.link(addr, key.privateKey, cidFrom, cidTo)
    }

    link(address, privKey, cidFrom, cidTo) {

        this.setState({
            query: getQueryStringValue('query')
        })

        axios({
            method: 'get',
            url: nodeUrl + '/account?address=' + address
        }).then(data => {

            const account = data.data.result.account

            console.log(account)

            const cyberdAcc = new cyberd.Account(address, constants.CyberdNetConfig.CHAIN_ID, parseInt(account.account_number, 10), parseInt(account.sequence, 10))
            const linkRequest = new cyberd.Request(cyberdAcc, cidFrom, cidTo, constants.TxType.LINK)

            axios({
                method: 'post',
                url: nodeUrl + '/link',
                data: cyberd.builder.buildAndSignTxRequest(linkRequest, privKey)
            })
                .then(data => console.log(data))
                .catch(err => console.log(err))

        })
        //
        // const account = new cyberd.Account(address, constants.CyberdNetConfig.CHAIN_ID, 0, 1)
        // const request = new cyberd.Request(account, "42", "0xSearch", constants.TxType.LINK)
        //
        // axios({
        //     method: 'post',
        //     url: 'http://localhost:8081/link',
        //     data: cyberd.builder.buildAndSignTxRequest(request, key.privateKey)
        // })
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err))
    }

    componentWillMount() {
        //
        const seed = "monkey wealth civil power dry powder camera silent avoid mango apology tomato clown proud since sample sing family major defy network earth absent bean"
        const addr = "cosmosaccaddr1g4jj0jvp5mp4kzvc4dfxn82gtjx5ysfpqqyamz"


        this.setState({
            query: getQueryStringValue('query')
        })

        const key = keypair.recover(seed)
        // this.link(addr, key.privateKey, "1", "2")
    }

    updateInputValue(evt) {
        this.setState({
            query: evt.target.value
        });
    }

    updateCidFromValue(evt) {
        this.setState({
            cidFrom: evt.target.value
        });
    }

    updateCidToValue(evt) {
        this.setState({
            cidTo: evt.target.value
        });
    }

    render() {
        return (
            <div>
                <input defaultValue={this.state.query} onChange={evt => this.updateInputValue(evt)}/>
                <button type="button" onClick={() => this.search()}>Search</button>
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
                <div>
                    Cid From: <input defaultValue={this.state.cidFrom} onChange={evt => this.updateCidFromValue(evt)}/>
                    Cid To: <input defaultValue={this.state.cidTo} onChange={evt => this.updateCidToValue(evt)}/>
                    <button type="button" onClick={() => this.linkTest()}>Link</button>
                </div>
            </div>
        )
    }
}

export default App;
