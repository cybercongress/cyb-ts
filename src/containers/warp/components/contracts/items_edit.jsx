import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EdittemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'address': null,
        'query_hash': null,
        'execute_hash': null,
        'version': null,
        'github': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(props.data.address);
    const [query_hash, setQueryHash] = useState(props.data.query_hash);
    const [execute_hash, setExecuteHash] = useState(props.data.execute_hash);
    const [version, setVersion] = useState(props.data.version);
    const [github, setGithub] = useState(props.data.github || "");


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

        if (!address.match(/[a-z0-9]{60,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'address': true,
                'hasError': true
            }));
        }

        if (!query_hash.match(/[a-z0-9]{20,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'query_hash': true,
                'hasError': true
            }));
        }
        if (!execute_hash.match(/[a-z0-9]{20,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'execute_hash': true,
                'hasError': true
            }));
        }

        if (!version.match(/[0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'version': true,
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

        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.editRow(props.data.id, address, query_hash, execute_hash, version, github);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit} onChange={()=>setFormChanged(true)}>
            <h1>Edit contract {props.data.address} </h1>

            <div className={error.address ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Contract address</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9 {'{60:90}'}</div>
                    <input type="text" placeholder="" value={address}
                       onChange={(e) => setAddress(e.target.value)}/>
                </div>
            </div>
            <div className={error.query_hash ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Query hash</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9</div>
                    <input className="form-control" type="text" placeholder="" value={query_hash}
                       onChange={(e) => setQueryHash(e.target.value)}/>
                </div>
            </div>
            <div className={error.execute_hash ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Execute hash</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9</div>
                    <input className="form-control" type="text" placeholder="" value={execute_hash}
                       onChange={(e) => setExecuteHash(e.target.value)}/>
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

            <div className={error.github ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Github</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: https://github.com/*/*.git</div>
                    <input className="form-control" type="text" placeholder="" value={github}
                       onChange={(e) => setGithub(e.target.value)}/>
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