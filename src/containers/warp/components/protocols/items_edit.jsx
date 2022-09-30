import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EdittemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'type': null,
        'particle': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(props.data.data_type);
    const [particle, setParticle] = useState(props.data.particle);


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
        let result = await props.onSelectInputFile(el);
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

        // let preparedMetadata=`display=${display}`;
        // setMetadata(preparedMetadata);

        try {
            await props.editRow(props.data.id,type, particle);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit} onChange={()=>setFormChanged(true)}>
            <h1>Edit token {props.data.type} </h1>


            <div className={error.type ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Data type</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: A-Z,0-9</div>
                    <input className="form-control" type="text" placeholder="example: tendermint_roc" value={type}
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