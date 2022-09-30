import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';

const AddItemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'type': null,
        'particle': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [loading, setLoading] = useState(false);
    let [type, setType] = useState('');
    const [particle, setParticle] = useState('');

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

        if (!type.match(/[a-z0-9\-]{2,40}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'type': true,
                'hasError': true
            }));
        }



        if (blockingError) {
            setLoading(false);
            return;
        }


        try {
            await props.addRow(type,particle);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit}>
            <h1>Add new protocol</h1>


            <div className={error.type ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Type</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z,0-9,-</div>
                    <input className="form-control" type="text" placeholder="example: rpc_api" value={type}
                           onChange={(e) => setType(e.target.value)}/>
                </div>

            </div>

            <div className={error.particle ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Particle</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: a-z0-9</div>
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
                    <span>Confirm add token</span>
                </button>

            </div>
        </form>
    )
}

export default AddItemForm;