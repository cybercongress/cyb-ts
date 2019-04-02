import { Container } from 'unstated';
import { getContentByCid, initIpfs } from '../../utils';

const APP_NAME = 'cyber';
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

        cidToValue: null,
        cidFromValue: null,
    };

    init = () => {
        if (!window.cyber) {
            return;
        }

        initIpfs();

        Promise
            .all([window.cyb.getQuery(), window.cyber.getDefaultAddress()])
            .then(([query, defaultAddressInfo]) => {
                this.setState({
                    browserSupport: true,
                    searchQuery: query,
                    defaultAddress: defaultAddressInfo.address,
                    balance: defaultAddressInfo.balance,
                }, () => {
                    this.search(query);
                });
            });

        window.cyb
            .onQueryUpdate((query) => {
                this.search(query);
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

                this.link(APP_NAME, query);
            });
        } else {
            this.setState({
                searchQuery: query,
                links: {},
            });
        }
    };

    link = (from, to) => {
        const {
            defaultAddress, cidFromValue, cidToValue, searchQuery,
        } = this.state;

        const cidFrom = from || cidFromValue || searchQuery;
        const cidTo = to || cidToValue;

        if (!defaultAddress || !cidFrom || !cidTo) {
            console.log(`Not enough arguments for link. 
                Addr: ${defaultAddress}, from: ${cidFrom}, to: ${cidTo}`);

            return;
        }

        window.cyber.link(cidFrom, cidTo, defaultAddress)
            .then((result) => {
                console.log(`Linked ${cidFrom} with ${cidTo}. Results: `, result);

                if (cidFrom === searchQuery) {
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
                }

                this.setState({
                    cidFromValue: null,
                    cidToValue: null,
                });
            })
            .catch((error) => {
                console.log(`Cant link ${cidFrom} with ${cidTo}. Error: `, error);

                this.setState({
                    linkResult: 'failed',
                    cidFromValue: null,
                    cidToValue: null,
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
                        status: 'failed',
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

    onCidFromChange = (e) => {
        this.setState({ cidFromValue: e.target.value });
    };

    onCidToChange = (e) => {
        this.setState({ cidToValue: e.target.value });
    }
}

export default new SearchContainer();
