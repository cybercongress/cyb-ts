import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EdittemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'name': null,
        'ticker': null,
        'denom': null,
        'display': null,
        'metadata': null,
        'chain_id': null,
        'logo': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(props.data.name);
    let [chain_id, setChainId] = useState(props.data.chain_id);
    const [ticker, setTicker] = useState(props.data.ticker);
    const [denom, setDenom] = useState(props.data.denom);
    const [metadata, setMetadata] = useState(props.data.metadata || "");
    const [display, setDisplay] = useState(props.data.metadata.split("=")[1]);
    const [logo, setLogo] = useState({ src: null, binary: null, ipfs: props.data.logo });

    const inputFileReference = useRef(null);

    const onDelete = async()=>{
        setLoading(true);
        await props.onDelete(props.data.id).catch((e)=>{
            setError(prevState => ({
                ...prevState,
                'total': e.message,
                'hasError': true
            }));
        })
        setLoading(false);
    }

    const onSelectLogo = async (el) => {
        let result = await props.onSelectLogo(el);
        if (result) {
            setLogo(result);
        }
    }


    const onSubmit = async (el) => {
        el.preventDefault();
        if (!changed) {
             props.onCancel()
            return;
        }

        setError(prevState => ({
            ...prevState,
            ...errorsInitiialParams
        }));

        if (loading) {
            return;
        }
        setLoading(true);
        let blockingError=false;

        if (!name.match(/[a-z0-9-]{2,40}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'name': true,
                'hasError': true
            }));
        }

        if (!ticker.match(/[A-Z0-9]{2,40}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'ticker': true,
                'hasError': true
            }));
        }
        if (!denom.match(/[0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'denom': true,
                'hasError': true
            }));
        }

        if (!display.match(/[0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'display': true,
                'hasError': true
            }));
        }

        // if (!metadata.match(/[a-zA-Z0-9,-=&]/)) {
        //     blockingError=true;
        //     setError(prevState => ({
        //         ...prevState,
        //         'metadata': true,
        //         'hasError': true
        //     }));
        // }


        if (!logo.binary && !logo.ipfs) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'total': "Incorrect logo",
                'hasError': true
            }));
        }

        if (!chain_id) {
            chain_id=chain_id || props.networks[0].chain_id;
        }


        if (blockingError) {
            setLoading(false);
            return;
        }

        let preparedMetadata=`display=${display}`;
        setMetadata(preparedMetadata);

        try {
            await props.editRow(props.data.id, name, ticker, denom, metadata, chain_id, logo.binary);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }

    const openFileDialog = () => {
        inputFileReference.current.click();
    };

    const removeSelectedImage = () => {
        setLogo({ src: null, binary: null, ipfs: null });
        inputFileReference.current.value = null;
    };


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit} onChange={()=>setFormChanged(true)}>
            <h1>Edit token {props.data.name} </h1>

            <div className={error.name ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Token name</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input type="text" placeholder="example: ethereum" value={name}
                       onChange={(e) => setName(e.target.value)}/>
                </div>
            </div>
            <div className={error.ticker ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Ticker</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: A-Z,0-9</div>
                    <input className="form-control" type="text" placeholder="example: ETH" value={ticker}
                       onChange={(e) => setTicker(e.target.value)}/>
                </div>
            </div>
            <div className={styles.containerWarpFieldsInputContainerItem}>
                <span>Network</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <select defaultValue={chain_id} onChange={(e) => setChainId(e.target.value)}>
                        {props.networks.map(function(network, i){
                            return <option key={network.chain_id} value={network.chain_id}>{network.name}</option>;
                        })}
                    </select>
                </div>
            </div>
            <div className={error.denom ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Denomination</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: 0-9</div>
                    <input className="form-control" type="number" placeholder="" value={denom}
                       onChange={(e) => {setDenom(e.target.value); setDisplay(e.target.value)}}/>
                </div>
            </div>
            <div className={error.display ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Display denomination</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: 0-9</div>
                    <input className="form-control" type="number" placeholder="example: 6" value={display}
                           onChange={(e) => setDisplay(e.target.value)}/>
                </div>
            </div>

            {/* <div className={error.metadata ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}> */}
            {/*     <span>Metadata</span> */}
            {/*     <input className="form-control" type="text" placeholder="" value={metadata} */}
            {/*            onChange={(e) => setMetadata(e.target.value)}/> */}
            {/* </div> */}

            <div className={styles.containerWarpFieldsInputContainerItem}>
                <span>Logo</span>
                <input
                    onChange={onSelectLogo}
                    ref={inputFileReference}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}/>
                <div>
                    {((logo && (logo.src || logo.ipfs)) ) && (
                        <img
                            src={(logo.src) ? (logo.src) : getIpfsCidExternalLink(logo.ipfs)}
                            alt="Thumb"
                            width="128"
                        />
                    )}
                    <button
                        type="button"
                        className={((logo && (logo.src || logo.ipfs)) ) ? 'btn-add-close' : 'btn-add-file'}
                        onClick={(((logo && (logo.src || logo.ipfs)) )) ? removeSelectedImage : openFileDialog}
                    />
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
                <input type="reset" className="btn " value="Cancel" onClick={props.onCancel} />
                <button type="submit"  className={`btn  pull-right ${loading ? 'btn-loading' : ''}`} >
                    <span className="button__text">Save</span>
                </button>
            </div>
            <div>
                <button type="button" className={`btn btn-red pull-right ${loading ? 'btn-loading' : ''}`} onClick={onDelete} >
                    <span className="button__text">Delete</span>
                </button>
            </div>
        </form>
    )
}

export default EdittemForm;