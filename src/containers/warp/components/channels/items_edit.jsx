import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EdittemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'sourceChannelId': null,
        'destChannelId': null,
        'sourceChainId': null,
        'destinationChainId': null,
        'rpc': null,
        'token': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sourceChannelId, setSourceChannelId] = useState(props.data.sourceChannelId);
    const [destChannelId, setDestChannelId] = useState(props.data.destChannelId);
    const [sourceChainId, setSourceChainId] = useState(props.data.sourceChainId);
    const [destinationChainId, setDestinationChainId] = useState(props.data.destinationChainId);
    const [rpc, setRpc] = useState(props.data.rpc);
    const [token, setToken] = useState(props.data.token);


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

        if (!sourceChannelId.match(/[a-z0-9-]{2,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'sourceChannelId': true,
                'hasError': true
            }));
        }

        if (!destChannelId.match(/[a-z0-9-]{2,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'destChannelId': true,
                'hasError': true
            }));
        }
        if (!sourceChainId.match(/[a-z0-9]{2,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'sourceChainId': true,
                'hasError': true
            }));
        }
        if (!destinationChainId.match(/[a-z0-9]{2,70}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'destinationChainId': true,
                'hasError': true
            }));
        }

        if (!token.match(/[A-Z0-9]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'token': true,
                'hasError': true
            }));
        }

        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.editRow(props.data.id, sourceChannelId, destChannelId, sourceChainId, destinationChainId, rpc, token);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit} onChange={()=>setFormChanged(true)}>
            <h1>Edit channel {props.data.token} </h1>

            <div className={error.sourceChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Source chain id</span>
                <input type="text" placeholder="" value={sourceChannelId}
                       onChange={(e) => setSourceChainId(e.target.value)}/>
            </div>
            <div className={error.sourceChannelId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Source channel-id</span>
                <input className="form-control" type="text" placeholder="" value={sourceChannelId}
                       onChange={(e) => setSourceChannelId(e.target.value)}/>
            </div>

            <div className={error.destinationChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Destination chain id</span>
                <input type="text" placeholder="" value={sourceChannelId}
                       onChange={(e) => setDestinationChainId(e.target.value)}/>
            </div>
            <div className={error.destChannelId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Destination channel-id</span>
                <input className="form-control" type="text" placeholder="" value={destChannelId}
                       onChange={(e) => setDestChannelId(e.target.value)}/>
            </div>

            <div className={error.rpc ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Rpc addr</span>
                <input className="form-control" type="text" placeholder="" value={rpc}
                       onChange={(e) => setRpc(e.target.value)}/>
            </div>
            <div className={error.token ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Token</span>
                <input className="form-control" type="text" placeholder="" value={token}
                       onChange={(e) => setToken(e.target.value)}/>
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