import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { setgid } from "process";

const AddItemForm = props => {
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

    const [loading, setLoading] = useState(false);
    // const [address, setAddress] = useState('');
    const [sourceChannelId, setSourceChannelId] = useState('');
    const [destChannelId, setDestChannelId] = useState('');
    const [sourceChainId, setSourceChainId] = useState('');
    const [destinationChainId, setDestinationChainId] = useState('');
    const [rpc, setRpc] = useState('');
    const [token, setToken] = useState('');


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

        if (!rpc.match(/[a-z0-9:\/\{\}]/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'rpc': true,
                'hasError': true
            }));
        }


        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.addRow(destinationChainId,destChannelId,sourceChainId,sourceChannelId,rpc, token);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }



    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit}>
            <h1>Add new channel</h1>

            <div className={error.sourceChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Source chain id</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input type="text" placeholder="" value={sourceChainId}
                       onChange={(e) => setSourceChainId(e.target.value)}/>
                </div>
            </div>
            <div className={error.sourceChannelId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Destination channel-id</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input className="form-control" type="text" placeholder="" value={sourceChannelId}
                       onChange={(e) => setSourceChannelId(e.target.value)}/>
                </div>
            </div>

            <div className={error.destinationChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Destination chain id</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input type="text" placeholder="" value={destinationChainId}
                       onChange={(e) => setDestinationChainId(e.target.value)}/>
                </div>
            </div>
            <div className={error.destChannelId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Destination channel-id</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input className="form-control" type="text" placeholder="" value={destChannelId}
                       onChange={(e) => setDestChannelId(e.target.value)}/>
                </div>
            </div>

            <div className={error.rpc ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Rpc addr</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: https://domain.com/{'{ addr }'},http://1.1.1.1/query/{'{ addr }'}</div>
                    <input className="form-control" type="text" placeholder="" value={rpc}
                       onChange={(e) => setRpc(e.target.value)}/>
                </div>
            </div>
            <div className={error.token ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Token</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: A-Z,0-9</div>
                    <input className="form-control" type="text" placeholder="" value={token}
                       onChange={(e) => setToken(e.target.value)}/>
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
                    <span>Confirm add channel</span>
                </button>

            </div>
        </form>
    )
}

export default AddItemForm;