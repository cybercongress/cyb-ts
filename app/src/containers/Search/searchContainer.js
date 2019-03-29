import React from 'react';
import { Container } from 'unstated';
import { getContentByCid, initIpfs } from '../../utils';

const APP_NAME = '.cyber';
const SEARCH_RESULT_TIMEOUT_MS = 15000;

class SearchContainer extends Container {
    state = {
        browserSupport: false,

        defaultAddress: null,
        balance: 0,

        links: {},
        searchQuery: '',
        seeAll: false,

        linkResult: '',
    };

    constructor() {
        super();

        this.cidToInput = React.createRef();
    }

    init = () => {
        if (!window.cyber) {
            return;
        }

        initIpfs();

        window.cyb
            .getQuery()
            .then((query) => {
                this.setState({
                    browserSupport: true,
                    searchQuery: query,
                }, () => {
                    this.search(query);
                });
            });

        window.cyb
            .onQueryUpdate((query) => {
                this.search(query);
            });

        window.cyber
            .getDefaultAddress()
            .then(({ address, balance }) => {
                this.setState({
                    defaultAddress: address,
                    balance,
                });
            });
    };

    search = (query) => {
        console.log('search query: ', query);

        if (query) {
            window.cyber.searchCids(query).then((result) => {
                console.log('result cids: ', result);

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
            this.setState({
                searchQuery: query,
                links: {},
            });
        }
    };

    link = (from, to) => {
        const address = this.state.defaultAddress;
        const cidFrom = from || this.state.searchQuery;
        const cidTo = to || this.cidToInput.current.value;

        if (!address) {
            return;
        }

        window.cyber.link(cidFrom, cidTo, address)
            .then((result) => {
                console.log(`Linked ${cidFrom} with ${cidTo}. Results: `, result);

                this.setState(state => ({
                    linkResult: 'success',
                    links: {
                        ...state.links,
                        newLink: {
                            rank: 'n/a',
                            status: 'success',
                            content: cidTo,
                        },
                    },
                }));
            })
            .catch((error) => {
                console.log(`Cant link ${cidFrom} with ${cidTo}. Error: `, error);

                this.setState({
                    linkResult: 'failed',
                });
            });
    };

    loadContent = async (cids) => {
        const contentPromises = Object.keys(cids)
            .map(cid => getContentByCid(cid, SEARCH_RESULT_TIMEOUT_MS)
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
                .catch(() => {
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
    };

    seeAll = () => {
        this.setState(state => ({
            seeAll: !state.seeAll,
        }));
    };

    openLink = (e, content) => {
        const { balance, defaultAddress, searchQuery } = this.state;
        const cidFrom = searchQuery;
        const cidTo = content;

        console.log(`from: ${cidFrom} to: ${cidTo}. address: ${defaultAddress}. balance: ${balance}`);

        window.cyber.link(cidFrom, cidTo, defaultAddress);
    };
}

export default new SearchContainer();
