import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../../../../context';
import { makeTags } from '../../../../utils/utils';
import InstanceRow from './InstanceRow';

const initDetails = {
  checksum: '',
  creator: '',
  data: '',
  id: '',
};

const useGetContractsInfo = (codeId) => {
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
  }, [jsCyber, codeId]);

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
  const { uploadTxHash, contracts, details } = useGetContractsInfo(codeId);

  return (
    <main className="block-body">
      <div>
        CodePage
        <hr />
        <br />
        <div>
          <div>
            <div>code #{codeId}</div>
            <div>
              <div>type Wasm</div>
              <div>
                Size:{' '}
                {details.data.length > 0 &&
                  Math.round(details.data.length / 1024)}{' '}
                KiB
              </div>
            </div>
          </div>
          <div>
            <div>Upload transaction: {uploadTxHash}</div>
            <div>Creator: {details.creator}</div>
            <div>Checksum: {details.checksum}</div>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Label</th>
                <th scope="col">Contract</th>
                <th scope="col">Creator</th>
                <th scope="col">Admin</th>
                <th scope="col">Executions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((address, index) => (
                <InstanceRow
                  position={index + 1}
                  address={address}
                  key={address}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default CodePage;
