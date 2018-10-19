import React, {Component} from 'react';
import axios from 'axios'
import {
    create as createCyberdAccount,
    import as importCyberdAccount,
    recover as recoverCyberdAccount
} from "../core/crypto";

const cyberd = require('../core/builder')
const constants = require('../core/constants')

const styles = require('./app.less');

const nodeUrl = 'http://localhost:26660';

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        query: '',
        cidFrom: '',
        cidTo: '',
        links: [],
        accounts: [],
        defaultAccount: '',
        chainId: 'test-chain-fbqPMq',
        showAccounts: false
    };

    search() {
        const cid = this.state.query;
        console.log(cid);

        axios({
            method: 'get',
            url: nodeUrl + '/search?cid=' + cid,
        })
            .then(data => {
                let cids = data.data.result.cids;
                let links = [];

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
        const cidFrom = this.state.cidFrom;
        const cidTo = this.state.cidTo;

        console.log("from: " + cidFrom + " to: " + cidTo);

        const addr = this.state.defaultAccount.address;
        const privateKey = this.state.defaultAccount.privateKey;

        this.link(addr, privateKey, cidFrom, cidTo)
    }

    link(address, privKey, cidFrom, cidTo) {
        this.setState({
            query: getQueryStringValue('query')
        });

        axios({
            method: 'get',
            url: nodeUrl + '/account?address=' + address
        }).then(data => {

            const account = data.data.result.account;
            const chainId = this.state.chainId;

            console.log(account);

            const cyberdAcc = new cyberd.Account(address, chainId, parseInt(account.account_number, 10), parseInt(account.sequence, 10));
            const linkRequest = new cyberd.Request(cyberdAcc, cidFrom, cidTo, constants.TxType.LINK);

            axios({
                method: 'post',
                url: nodeUrl + '/link',
                data: cyberd.builder.buildAndSignTxRequest(linkRequest, privKey)
            })
                .then(data => console.log(data))
                .catch(err => console.log(err))

        })
    }

    componentWillMount() {
        this.setState({
            query: getQueryStringValue('query')
        });

        this.restoreAccountsFromLs().then(accounts => {
            if (this.state.defaultAccount === '' && accounts.length > 0) {
                this.setDefaultAccount(accounts[0]);
            }
        }).then(() =>
            this.search()
        )
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

        const accounts = this.state.accounts.map(account => {
            const cssClassName = account.address === this.state.defaultAccount.address ? styles.defaultAccount : styles.account;
            return <div
                onClick={() => this.setDefaultAccount(account)}
                key={account.address}
                className={cssClassName}>
                <div>
                    address: {account.address}
                </div>
                <div>
                    public key: {account.publicKey}
                </div>
                <div>
                    private key: {account.privateKey}
                </div>
                <div>
                    balance: {account.balance}
                </div>
                <button onClick={() => this.deleteAccount(account)}>remove</button>
            </div>
        });

        return (
            <div>
                <input defaultValue={this.state.query} onChange={evt => this.updateInputValue(evt)}/>
                <button type="button" onClick={() => this.search()}>Search</button>

                <div>
                    <p>Search results:</p>
                    {
                        this.state.links.map(link =>
                            <div key={link.hash}>
                                <a href={`cyb://${link.hash}`}> {link.hash} </a>
                            </div>
                        )
                    }
                </div>

                <div>
                    <p>Manual link:</p>
                    Cid From: <input defaultValue={this.state.cidFrom} onChange={evt => this.updateCidFromValue(evt)}/>
                    Cid To: <input defaultValue={this.state.cidTo} onChange={evt => this.updateCidToValue(evt)}/>
                    <button type="button" onClick={() => this.linkTest()}>Link</button>
                </div>

                <div>
                    <hr/>
                </div>
                <button onClick={this.switchAccountManagement}>Accounts management</button>
                {this.state.showAccounts &&
                <span>
                        <p>Accounts: </p>
                        <div>
                            {accounts}
                        </div>

                        <hr/>
                        <button onClick={this.createAccount}>Create new account</button>
                        <div>
                            <p>Recover</p>
                            <input ref='recoverInput' placeholder='seed for recover'/>
                            <button onClick={this.recoverAccount}>recover</button>
                        </div>
                        <div>
                            <p>Import</p>
                            <input ref='privateKeyInput' placeholder='private key for import'/>
                            <button onClick={this.importAccount}>import</button>
                        </div>
                    </span>
                }
            </div>
        )
    }

    switchAccountManagement = () => {
        this.setState({
            showAccounts: !this.state.showAccounts
        })
    };

    setDefaultAccount = (account) => {
        this.setState({
            defaultAccount: account
        });
        this.saveAccountsToLs();
    };

    createAccount = () => {
        const account = createCyberdAccount('');

        this._addAccountAndSaveToLs(account);
    };

    importAccount = () => {
        const privateKey = this.refs.privateKeyInput.value;
        const account = importCyberdAccount(privateKey);

        this._addAccountAndSaveToLs(account);
    };

    recoverAccount = () => {
        const privateKey = this.refs.recoverInput.value;
        const account = recoverCyberdAccount(privateKey);
        this._addAccountAndSaveToLs(account);
    };

    deleteAccount = (account) => {
        let accounts = this.state.accounts;

        accounts = accounts.filter(acc => acc.address !== account.address);
        this.setState({
            accounts: accounts
        });

        if (account === this.state.defaultAccount && accounts.length > 0) {
            this.setState({
                defaultAccount: accounts[0]
            })
        }
    };

    _addAccountAndSaveToLs = (account) => {
        let accounts = this.state.accounts;

        accounts.push({
            address: account.address,
            publicKey: account.publicKey,
            privateKey: account.privateKey,
            balance: 0
        });

        this.setState({
            accounts: accounts
        });

        this.saveAccountsToLs();
    };

    saveAccountsToLs = () => {
        localStorage.setItem('cyberdAccounts', JSON.stringify(this.state.accounts));
        localStorage.setItem('cyberdDefaultAccount', JSON.stringify(this.state.defaultAccount));
    };

    restoreAccountsFromLs = () => new Promise(resolve => {
        const _accounts = JSON.parse(localStorage.getItem('cyberdAccounts') || '[]');
        const defaultAccountRaw = localStorage.getItem('cyberdDefaultAccount') || '';
        const defaultAccount = defaultAccountRaw ? JSON.parse(defaultAccountRaw) : '';

        Promise.all(
            _accounts.map(acc => new Promise(resolve => {
                axios({
                    method: 'get',
                    url: nodeUrl + '/account?address=' + acc.address
                }).then(data => {

                    if (!data.data.error) {
                        const account = data.data.result.account;
                        acc.balance = account.coins[0].amount;
                    }
                    resolve(acc);
                })
            }))
        ).then(accounts => {
            this.setState({
                accounts: accounts,
                defaultAccount: defaultAccount
            });
            this.saveAccountsToLs();

            resolve(accounts)
        });
    })
}

export default App;
