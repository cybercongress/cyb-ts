import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { setgid } from "process";
import { getPin, getPinsCid,getIpfsCidExternalLink } from '../../../../utils/search/utils';

const AddItemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'address': null,
        'query_hash': null,
        'execute_hash': null,
        'version': null,
        'network': null,
        'particle': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [query_hash, setQueryHash] = useState({src: null, binary: null,ipfs: null});
    const [execute_hash, setExecuteHash] = useState({src: null, binary: null,ipfs: null});
    const [version, setVersion] = useState('');
    let [network, setNetwork] = useState('');
    let [particle, setParticle] = useState('');



    const onSelectExecuteMapJson = async(el)=>{
        let result = await props.onSelectInputFile(el);
        if (result) {
            let {toCid}=await props.pushIpfsFile(result.binary);
            setExecuteHash({src: result.src,src: result.binary,ipfs: toCid} );
        }
    };

    const onSelectQueryMapJson = async(el)=>{
        let result = await props.onSelectInputFile(el);
        if (result) {
            let {toCid}=await props.pushIpfsFile(result.binary);
            setQueryHash({src: result.src,src: result.binary,ipfs: toCid} );
        }
    };
    const onSubmit = async (el) => {
        setError(prevState => ({
            ...prevState,
            ...errorsInitiialParams
        }));

        el.preventDefault();

        if (loading) {
            return;
        }
        setLoading(true);
        let blockingError=false;

        if (!network) {
            network=network || props.networks[0].chain_id;
        }

        if (!address.match(/[a-z0-9]{60,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'address': true,
                'hasError': true
            }));
        }

        // if (!query_hash.match(/[a-z0-9]{20,70}/)) {
        //     blockingError=true;
        //     setError(prevState => ({
        //         ...prevState,
        //         'query_hash': true,
        //         'hasError': true
        //     }));
        // }
        // if (!execute_hash.match(/[a-z0-9]{20,70}/)) {
        //     blockingError=true;
        //     setError(prevState => ({
        //         ...prevState,
        //         'execute_hash': true,
        //         'hasError': true
        //     }));
        // }

        if (!version.match(/[0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'version': true,
                'hasError': true
            }));
        }

        // if (!github.match(/(?:git@|https:\/\/)github.com[:\/](.*).git/g)) {
        //     blockingError=true;
        //     setError(prevState => ({
        //         ...prevState,
        //         'github': true,
        //         'hasError': true
        //     }));
        // }




        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.addRow(network, address, query_hash, execute_hash, version, particle);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }



    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit}>
            <h1>Add new contract</h1>

            <div className={error.sourceChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Network</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <select defaultValue={network} onChange={(e) => setNetwork(e.target.value)}>
                        {props.networks.map(function(network, i){
                            return <option key={network.chain_id} value={network.chain_id}>{network.chain_id}</option>;
                        })}
                    </select>
                </div>

                {/* <div className={styles.containerWarpFieldsInputContainerItemEditable}> */}
                {/*     <div className="field-mask">mask: a-z,0-9,-</div> */}
                {/*     <input type="text" placeholder="" value={sourceChainId} */}
                {/*            onChange={(e) => setSourceChainId(e.target.value)}/> */}
                {/* </div> */}
            </div>

            <div className={error.address ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Contract address</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9 {'{60:90}'}</div>
                    <input type="text" placeholder="" value={address}
                       onChange={(e) => setAddress(e.target.value)}/>
                </div>
            </div>
            <div className={styles.containerWarpFieldsInputContainerItem}>
                <span>Query map JSON</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">&nbsp;&nbsp;
                        {query_hash && query_hash.ipfs &&
                        <span><a target="_blank" href={getIpfsCidExternalLink(query_hash.ipfs)}>{query_hash.ipfs}</a></span>
                        }
                        {!query_hash || !query_hash.ipfs &&
                            <span>No map file selected</span>
                        }
                    </div>

                <input
                    onChange={onSelectQueryMapJson}
                    type="file"
                    accept=".json"
                    // style={{ display: 'none' }}
                />
                {/* <div> */}
                {/*     {logo && logo.src && ( */}
                {/*         <img */}
                {/*             src={(logo.src)} */}
                {/*             alt="Preview logo" */}
                {/*             width="128" */}
                {/*         /> */}
                {/*     )} */}
                {/*     <button */}
                {/*         type="button" */}
                {/*         className={logo && logo.src ? 'btn-add-close' : 'btn-add-file'} */}
                {/*         onClick={logo && logo.src ? removeSelectedImage : openFileDialog} */}
                {/*     /> */}
                {/* </div> */}
            </div>
            </div>
            {/* <div className={error.query_hash ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}> */}
            {/*     <span>Query hash</span> */}
            {/*     <div className={styles.containerWarpFieldsInputContainerItemEditable}> */}
            {/*         <div className="field-mask">mask: a-z,0-9</div> */}
            {/*         <input className="form-control" type="text" placeholder="" value={query_hash} */}
            {/*            onChange={(e) => setQueryHash(e.target.value)}/> */}
            {/*     </div> */}
            {/* </div> */}
            <div className={error.execute_hash ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Execute map JSON</span>

                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">&nbsp;&nbsp;
                        {execute_hash && execute_hash.ipfs &&
                            <span><a target="_blank" href={getIpfsCidExternalLink(execute_hash.ipfs)}>{execute_hash.ipfs}</a></span>
                        }
                        {!execute_hash || !execute_hash.ipfs &&
                            <span>No map file selected</span>
                        }
                    </div>
                    <input
                        onChange={onSelectExecuteMapJson}
                        type="file"
                        accept=".json"
                        // style={{ display: 'none' }}
                    />

                    {/* <input className="form-control" type="text" placeholder="" value={execute_hash} */}
                    {/*    onChange={(e) => setExecuteHash(e.target.value)}/> */}
                </div>
            </div>

            <div className={error.version ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Version</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,=,&</div>
                    <input className="form-control" type="text" placeholder="" value={version}
                       onChange={(e) => setVersion(e.target.value)}/>
                </div>
            </div>

            <div className={error.particle ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Particle</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z0-9-</div>
                    <input className="form-control" type="text" placeholder="" value={particle}
                       onChange={(e) => setParticle(e.target.value)}/>
                </div>
            </div>



            {error.hasError && (
                <Pane
                    paddingX={10}
                    paddingY={10}
                    marginTop="20px"
                    boxShadow="0 0 4px 0px #d32f2f"
                    borderRadius="5px"
                    backgroundColor="#d32f2f2b"
                >
                    {error.total || "Please fill correct data"}
                </Pane>
            )}


            <div>
                <input type="reset" className="btn " value="Cancel" onClick={props.onCancel}/>
                <button disabled={loading} type="submit" className={`btn  pull-right ${loading ? 'btn-loading' : ''}`}>
                    <span>Confirm add contract</span>
                </button>

            </div>
        </form>
    )
}

export default AddItemForm;