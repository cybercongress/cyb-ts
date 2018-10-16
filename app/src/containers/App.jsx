import React, {Component} from 'react';
import axios from 'axios'

const keypair = require('../core/keypair')
const codec = require('../util/codec')
const cyberd = require('../core/builder')
const constants = require('../core/constants')
const amino = require('../core/amino')
const crypto = require('../core/crypto')
const Web3 = require('web3');
require('../amino/examples/byteslice')

const {MsgLink, StdTx, PubKeySecp256k1, Coin, StdFee, StdSignature} = require('../core/msg')
const {Codec} = require('../amino/index')

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function ethereumAddressFromPrivateKey() {
    const addr = "0xbC682d39B783ED4A177F74ad5a986e0b4Ef3AF59"

    const addr2 = "0x3fbcf7304803669523083fe7749bb83deff45b28416949b21d4a39742eddbed7"
    const priv_key = "DAAA0980CFA70A87C4715553F0892FC8AA086BD528AD8D87C34DFB91FB25009A"
    const pub_key = "364D86033EFB13A7A4BF25D8923776DBD5244B05E427E2B8DEE4E222866C80BCEA4A4DB9DBEE7AA232C75045E210B391686981B6BC91ED7FBF992D70FB5B9829"

    const keccakHash = "0xe3b51381d334bbf8f1ac2e47bc682d39b783ed4a177f74ad5a986e0b4ef3af59"

    console.log("KECCAK256: ", Web3.utils.keccak256("0x364D86033EFB13A7A4BF25D8923776DBD5244B05E427E2B8DEE4E222866C80BCEA4A4DB9DBEE7AA232C75045E210B391686981B6BC91ED7FBF992D70FB5B9829"))

    let account = crypto.import(priv_key)
    console.log(account)
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

        console.log(key)

        console.log("ADDRESS: ", codec.bech32.toBech32('cosmosaccaddr', key.address))

        const account = new cyberd.Account(addr, "test-chain-PsZPAt", 0, 1)
        const request = new cyberd.Request(account, "42", "0xSearch", constants.TxType.LINK)

        const tx = cyberd.builder.buildAndSignTx(request, key.privateKey)

        console.log("TX: ", tx)


        amino.registerConcrete("cyberd/Link");
        amino.registerConcrete("auth/StdTx");

        // let codec2 = new Codec()
        // codec2.registerConcrete(new MsgLink(), "cyberd/Link", {})
        // codec2.registerConcrete(new StdTx(), "auth/StdTx", {})
        //
        //
        // const txBytes = codec2.marshalBinary(tx)

        // console.log("TX  BYTES:", txBytes)

        // const params = {
        // 	"tx": Array.from(txBytes)
        // }

        const url = 'http://localhost:8081/link'

        // const paramBytes = Buffer.from(JSON.stringify(params))

        // console.log("PARAMS:", params)

        const body = {
        	"method": "broadcast_tx_commit",
        	"jsonrpc": "2.0",
        	"params": {},
        	"id": "hvg123"
        }

        axios({
        	method: 'post',
        	url: url,
        	data: tx
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
