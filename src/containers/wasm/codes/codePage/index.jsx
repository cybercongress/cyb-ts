import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../context';
import { makeTags } from '../../../../utils/utils';
import InstantiationContract from '../../contract/InstantiationContract';
import CodeInfo from './CodeInfo';
import TableInstance from './TableInstance';
import styles from './styles.scss';
import { FlexWrapCantainer } from '../../ui/ui';

const initDetails = {
  checksum: '',
  creator: '',
  data: '',
  id: '',
};

const useGetContractsInfo = (codeId, updateFnc) => {
  const { jsCyber } = useContext(AppContext);
  const [details, setDetails] = useState(initDetails);
  const [contracts, setContracts] = useState([]);
  const [uploadTxHash, setUploadTxHash] = useState('');

  useEffect(() => {
    const getContracts = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.getContracts(codeId);
        console.log(`response getContracts`, response);
        setContracts(response);
      }
    };
    getContracts();
  }, [jsCyber, codeId, updateFnc]);

  useEffect(() => {
    const getCodeDetails = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.getCodeDetails(codeId);
        console.log(`response getCodeDetails`, response);
        setDetails(response);
      }
    };
    getCodeDetails();
  }, [jsCyber, codeId]);

  useEffect(() => {
    const searchTx = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.searchTx({
          tags: makeTags(
            `message.module=wasm&message.action=/cosmwasm.wasm.v1.MsgStoreCode&store_code.code_id=${codeId}`
          ),
        });
        const first = response.find(() => true);

        if (first.hash) {
          setUploadTxHash(first.hash);
        }
      }
    };
    searchTx();
  }, [jsCyber, codeId]);

  return { uploadTxHash, contracts, details };
};

function CodePage() {
  const { codeId } = useParams();
  const [updateFnc, setUpdateFnc] = useState(0);
  const { uploadTxHash, contracts, details } = useGetContractsInfo(
    codeId,
    updateFnc
  );

  return (
    <main className="block-body">
      <FlexWrapCantainer
        style={{ flexDirection: 'column', width: '60%', boxShadow: 'none' }}
      >
        <div className={styles.containerCodeDetailsHeader}>
          <div className={styles.containerCodeDetailsHeaderTitle}>
            Lib #{codeId}
          </div>
          <div className={styles.containerCodeDetailsHeaderFileInfo}>
            <div className={styles.containerCodeDetailsHeaderFileInfoType}>
              type: Wasm
            </div>
            <div>
              Size:{' '}
              {details.data.length > 0 &&
                Math.round(details.data.length / 1024)}{' '}
              KiB
            </div>
          </div>
        </div>
        <CodeInfo uploadTxHash={uploadTxHash} details={details} />
        <InstantiationContract
          updateFnc={() => setUpdateFnc((item) => item + 1)}
          codeId={codeId}
        />
      </FlexWrapCantainer>

      <TableInstance contracts={contracts} />
    </main>
  );
}

export default CodePage;
