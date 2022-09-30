import React, { useState, useRef } from 'react';
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';
import { getIpfsCidExternalLink } from "../../../../utils/search/utils";

const EdittemForm = props => {
    let errorsInitiialParams={
        'hasError': false,
        'data_type': null,
        'protocol': null,
        'chain_id': null,
        'url': null,
        'particle': null,
    };
    const [error, setError] = useState(errorsInitiialParams);

    const [changed, setFormChanged] = useState(false);
    const [loading, setLoading] = useState(false);

    let [data_type, setDataType] = useState(props.data.data_type);
    let [protocol, setProtocol] = useState(props.data.protocol);
    let [chain_id, setChainIDd] = useState(props.data.chain_id);
    const [url, setUrl] = useState(props.data.url);


    let [particle, setParticle] = useState(props.data.particle);


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

        if (!chain_id) {
            chain_id=chain_id || props.networks[0].chain_id;
        }

        if (!protocol) {
            protocol=protocol || props.protocols[0].data_type;
        }

        if (!data_type.match(/[a-z0-9\-]{2,60}/)) {
            blockingError=true;
            setError(prevState => ({
                ...prevState,
                'data_type': true,
                'hasError': true
            }));
        }

        if (blockingError) {
            setLoading(false);
            return;
        }

        try {
            await props.editRow(props.data.id, data_type, protocol, chain_id, url, particle);
        } catch (e) {
            setError({'total': e.message, 'hasError': true});

        }

        setLoading(false);

    }


    return (
        <form className={styles.containerWarpFieldsInputContainer} onSubmit={onSubmit} onChange={()=>setFormChanged(true)}>
            <h1>Edit endpoint</h1>

            <div className={error.sourceChainId ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Network</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <select defaultValue={chain_id} onChange={(e) => setChainIDd(e.target.value)}>
                        {props.networks.map(function(network, i){
                            return <option key={network.chain_id} value={network.chain_id}>{network.chain_id}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className={error.data_type ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Data-type</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    {/* <div className="field-mask">mask: a-z,0-9б-</div> */}
                    <input type="text" placeholder="" value={data_type}
                           onChange={(e) => setDataType(e.target.value)}/>
                </div>
            </div>

            <div className={error.protocol ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Protocol</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <select defaultValue={protocol} onChange={(e) => setProtocol(e.target.value)}>
                        {props.protocols.map(function(prot, i){
                            return <option key={prot.data_type} value={prot.data_type}>{prot.data_type}</option>;
                        })}
                    </select>
                </div>

            </div>

            <div className={error.url ? styles.containerWarpFieldsInputContainerItemError : styles.containerWarpFieldsInputContainerItem}>
                <span>Url</span>
                <div className={styles.containerWarpFieldsInputContainerItemEditable}>
                    <div className="field-mask">mask: url </div>
                    <input type="text" placeholder="" value={url}
                           onChange={(e) => setUrl(e.target.value)}/>
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