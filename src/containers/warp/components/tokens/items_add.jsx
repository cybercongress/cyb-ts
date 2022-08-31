import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';

const AddItemForm = props => {
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

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    let [chain_id, setChainId] = useState('');
    const [ticker, setTicker] = useState('');
    const [denom, setDenom] = useState('');
    const [display, setDisplay] = useState('');
    const [metadata, setMetadata] = useState('');
    const [logo, setLogo] = useState({ src: null, binary: null });

    const inputFileReference = useRef(null);

    const onSelectLogo = async (el) => {
        let result = await props.onSelectLogo(el);
        if (result) {
            setLogo(result);
        }
    }


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



        if (!logo.binary) {
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
            await props.addRow(name, ticker, denom, preparedMetadata, chain_id, logo.binary);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }

    const openFileDialog = () => {
        inputFileReference.current.click();
    };

    const removeSelectedImage = () => {
        setLogo({ src: null, binary: null });
        inputFileReference.current.value = { src: null, binary: null };
    };


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit}>
            <h1>Add new token</h1>

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
                    <input className="form-control" type="number" placeholder="example: 6" value={denom}
                           onChange={(e) => {
                               setDenom(e.target.value);setDisplay(e.target.value)
                           }}/>
                </div>
            </div>
            <div className={error.display ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Display denomination</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: 0-9</div>
                    <input className="form-control" type="number" placeholder="example: 6" value={denom}
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
                    {logo && logo.src && (
                        <img
                            src={(logo.src)}
                            alt="Preview logo"
                            width="128"
                        />
                    )}
                    <button
                        type="button"
                        className={logo && logo.src ? 'btn-add-close' : 'btn-add-file'}
                        onClick={logo && logo.src ? removeSelectedImage : openFileDialog}
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
                <input type="reset" className="btn " value="Cancel" onClick={props.onCancel}/>
                <button disabled={loading} type="submit" className={`btn  pull-right ${loading ? 'btn-loading' : ''}`}>
                    <span>Confirm add token</span>
                </button>

            </div>
        </form>
    )
}

export default AddItemForm;