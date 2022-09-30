import React, {    useContext,    useEffect,    useState,} from 'react';import { connect } from 'react-redux';import { useLocation, useHistory, Route } from 'react-router-dom';import { Pane } from '@cybercongress/gravity';import BigNumber from 'bignumber.js';import queryString from 'query-string';import { AppContext } from '../../context';import { CYBER, DEFAULT_GAS_LIMITS, WARP_CONTRACTS } from '../../utils/config';import useSetActiveAddress from '../../hooks/useSetActiveAddress';import txs from '../../utils/txs';import { getPin, getPinsCid, getIpfsGatway, getTxs } from '../../utils/search/utils';import { GasPrice } from '@cosmjs/launchpad';import { Dots, ValueImg, ButtonIcon } from '../../components';import ItemsList from './components/contracts/items_list';import AddItemForm from './components/contracts/items_add';import EditItemForm from './components/contracts/items_edit';import styles from './warp.scss';function WarpContracts({ defaultAccount, ipfs, statusChecker, onSelectInputFile, pushIpfsFile}) {    const { jsCyber, keplr } = useContext(AppContext);    const location = useLocation();    const history = useHistory();    const { addressActive } = useSetActiveAddress(defaultAccount);    const [update, setUpdate] = useState(0);    const [editing, setEditing] = useState(false);    const [creating, setCreating] = useState(false);    const [contractData, setContractData] = useState([]);    const [networks, setNetworks] = useState([]);    const loadNetworksData = (jsCyber, offset) => {        const data = jsCyber.queryContractSmart(            WARP_CONTRACTS.NETWORKS,            {                "get_items": {}            }        );        data.then((result) => {            setNetworks(result.entries);        });    };    const loadContractData = (jsCyber, offset) => {        const data = jsCyber.queryContractSmart(            WARP_CONTRACTS.CONTRACTS,            {                "get_items": {}            }        );        data.then((result) => {            setContractData(result.entries);        });    };    const getItems = (offset) => {        useEffect(() => {            if (jsCyber === null) {                return;            }            loadContractData(jsCyber);        }, [jsCyber]);        return { contractData };    };    const deleteRow = async (id) => {        return new Promise(async (accept, reject) => {            try {                const gasPrice = GasPrice.fromString('0.001boot');                const [{ address }] = await keplr.signer.getAccounts();                const outgoinxTxData = await keplr.execute(                    address,                    WARP_CONTRACTS.CONTRACTS,                    {                        "DeleteEntry": {                            "id": id                        }                    },                    txs.calculateFee(400000, gasPrice)                );                let txData = await statusChecker(outgoinxTxData.transactionHash);                if (txData.raw_log.indexOf('failed') !== -1) {                    return reject(new Error(txData.raw_log));                }                setTimeout(() => {                    setEditing(false);                    loadContractData(jsCyber);                    accept()                }, 300);            } catch (e) {                reject(e)            }        })    };    const editRow = async (id, network, contractAddress, query_hash, execute_hash, version, particle) => {        return new Promise(async (accept, reject) => {            try {                const gasPrice = GasPrice.fromString('0.001boot');                try {                    const [{ address }] = await keplr.signer.getAccounts();                    let options = { "id": id, };                    if (contractAddress) {                        options['address'] = contractAddress;                    }                    if (network) {                        options['chain_id'] = network;                    }                    if (query_hash) {                        options['query_cid'] = query_hash.ipfs;                    }                    if (execute_hash) {                        options['execute_cid'] = execute_hash.ipfs;                    }                    if (version) {                        options['version'] = version;                    }                    if (particle) {                        options['particle'] = particle;                    }                    const outgoinxTxData = await keplr.execute(                        address,                        WARP_CONTRACTS.CONTRACTS,                        {                            "UpdateEntry": options                        },                        txs.calculateFee(400000, gasPrice)                    );                    let txData = await statusChecker(outgoinxTxData.transactionHash);                    if (txData.raw_log.indexOf('failed') !== -1) {                        return reject(new Error(txData.raw_log));                    }                    setTimeout(() => {                        loadContractData(jsCyber);                        setEditing(false);                        accept();                    }, 300);                } catch (e) {                    reject(e);                }            } catch (e) {                reject(e);            }        })    };    const addRow = async (network, contractAddress, query_hash, execute_hash, version, particle) => {        return new Promise(async (accept, reject) => {            try {                const gasPrice = GasPrice.fromString('0.001boot');                const [{ address }] = await keplr.signer.getAccounts();                let entryData={                    "address": contractAddress,                    // "query_hash": query_hash.ipfs,                    // "execute_hash": execute_hash,                    "chain_id": network,                    "version": version,                };                if (query_hash.ipfs) {                    entryData['query_cid']=query_hash.ipfs;                }                if (execute_hash.ipfs) {                    entryData['execute_cid']=execute_hash.ipfs;                }                if (particle) {                    entryData['particle']=particle;                }                try {                    const outgoinxTxData = await keplr.execute(                        address,                        WARP_CONTRACTS.CONTRACTS,                        {                            "NewEntry": entryData                        },                        txs.calculateFee(400000, gasPrice)                    );                    let txData = await statusChecker(outgoinxTxData.transactionHash);                    if (txData.raw_log.indexOf('failed') !== -1) {                        return reject(new Error(txData.raw_log));                    }                    setTimeout(() => {                        loadContractData(jsCyber);                        setCreating(false);                        accept();                    }, 300);                } catch (e) {                    reject(e);                }            } catch (e) {                reject(e);            }        })    };    getItems();    useEffect(() => {        if (jsCyber === null) {            return;        }        loadNetworksData(jsCyber);    }, [jsCyber]);    let content;    content = (        <div style={{ width: "100%" }}>            <h1>Contracts</h1>            <div>                {editing ? (                    <div>                        <EditItemForm networks={networks} pushIpfsFile={pushIpfsFile} data={editing} onSelectInputFile={onSelectInputFile} editRow={editRow} onCancel={(e) => setEditing(false)}                                      onDelete={deleteRow}/>                    </div>                ) : (creating ? (                        <div>                            <AddItemForm networks={networks} pushIpfsFile={pushIpfsFile} onSelectInputFile={onSelectInputFile} addRow={addRow} onCancel={(e) => setCreating(false)}/>                        </div>                    ) : <div></div>                )                }            </div>            <div className={styles.containerWarpFieldsInputContainer}>                <h2>Available contracts</h2>                <ItemsList items={contractData} onEdit={(params) => setEditing(params)}/>                <input type="button" className="btn " value="Add new contract" onClick={(e) => setCreating(true)}/>            </div>        </div>    );    return (        <>            <main className="block-body">                <Pane                    width="100%"                    display="flex"                    alignItems="center"                    flexDirection="column"                >                    {content}                </Pane>            </main>        </>    );}const mapStateToProps = (store) => {    return {        mobile: store.settings.mobile,        defaultAccount: store.pocket.defaultAccount,        ipfs: store.ipfs.ipfs,    };};export default connect(mapStateToProps)(WarpContracts);