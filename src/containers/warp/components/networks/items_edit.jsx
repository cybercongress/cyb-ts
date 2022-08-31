import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EditItemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'name': null,
        'github': null,
        'genesis_hash': null,
        'chain_id': null,
        'unbonding_period': null,
        'logo': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(props.data.name);
    const [github, setGithub] = useState(props.data.github);
    const [genesis_hash, setGenesisHash] = useState(props.data.genesis_hash);
    const [chain_id, setChainId] = useState(props.data.chain_id);
    const [unbonding_period, setUnbondingPeriod] = useState(props.data.unbonding_period);
    const [logo, setLogo] = useState({ src: null, binary: null, ipfs: props.data.logo, });

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
        if (!chain_id.match(/[a-z0-9-]{2,40}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'chain_id': true,
                'hasError': true
            }));
        }
        if (!genesis_hash.match(/[a-z0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'genesis_hash': true,
                'hasError': true
            }));
        }
        if (!unbonding_period.match(/[0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'unbonding_period': true,
                'hasError': true
            }));
        }
        if (!github.match(/(?:git@|https:\/\/)github.com[:\/](.*).git/g)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'github': true,
                'hasError': true
            }));
        }


        if (!logo.binary && !logo.ipfs) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'total': "Incorrect logo",
                'hasError': true
            }));
        }


        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.editRow(props.data.id, name, chain_id, github, genesis_hash, unbonding_period, logo.binary);
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
            <h1>Edit network {props.data.name} </h1>

            <div className={error.name ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Network name</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input type="text" placeholder="example: cyber" value={name}
                       onChange={(e) => setName(e.target.value)}/>
                </div>
            </div>
            <div className={error.chain_id ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Chain id</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input className="form-control" type="text" placeholder="example: bostrom" value={chain_id}
                       onChange={(e) => setChainId(e.target.value)}/>
                </div>
            </div>
            <div className={error.genesis_hash ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Genesis hash</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9</div>
                    <input className="form-control" type="text" placeholder="" value={genesis_hash}
                       onChange={(e) => setGenesisHash(e.target.value)}/>
                </div>
            </div>
            <div className={error.github ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Github</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: https://github.com/*/*.git</div>
                    <input className="form-control" type="text" placeholder="example: https://github.com/myteam/product.git" value={github}
                       onChange={(e) => setGithub(e.target.value)}/>
                </div>
            </div>
            <div className={error.unbonding_period ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Unbonding Period</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: 0-9</div>
                    <input className="form-control" type="number" placeholder="" value={unbonding_period}
                       onChange={(e) => setUnbondingPeriod(e.target.value)}/>
                </div>
            </div>


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

export default EditItemForm;