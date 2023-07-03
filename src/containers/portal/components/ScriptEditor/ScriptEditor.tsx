import React, { useCallback, useState, useEffect } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { Pane } from '@cybercongress/gravity';
// import { ContainerGradientText } from 'src/components';
import { Button, Input } from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';
import { rust } from '@codemirror/lang-rust';
import {
  scriptItemStorage,
  runScript,
  saveScript,
} from 'src/services/scripting/engine';
import { useSigningClient } from 'src/contexts/signerClient';
import styles from './ScriptEditor.module.scss';

import { MainContainer } from '..';
import { updatePassportData } from '../../utils';

function ScriptEditor() {
  const { signer, signingClient } = useSigningClient();
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [testCid, seTestCid] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);

  // useEffect(() => {
  //   setCode(passport?.extension.data || scriptItemStorage.particle.user);
  // }, [passport]);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
    setIsChanged(true);
    setLog('');
  }, []);

  const onSave = () => {
    runScript(
      code,
      {
        cid: '',
        contentType: '',
        content: '',
      },
      scriptItemStorage.particle.runtime,
      undefined,
      false
    ).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      console.log('----result', result, isOk);
      const msg = !isOk ? `Errors:\r\n${result.diagnosticsOutput}` : 'Success!';
      setLog(msg);
      saveScript('particle', code);
      setIsChanged(false);
      setLog((log) => `${log}\r\nSaved to local storage.`);
      // if (isOk) {
      //   return updatePassportData(passport?.extension.nickname, code, {
      //     signer,
      //     signingClient,
      //   }).then((res) =>
      //     setLog((log) => `${log}\r\nSaved, tx: ${res.transactionHash}`)
      //   );
      // }
    });
  };

  if (!signer || !signingClient) {
    return <div>Wallet is not connected.</div>;
  }

  if (!passport) {
    return <div>Passport required, for this action.</div>;
  }

  return (
    <div>
      <main className="block-body">
        <Pane marginBottom="10px" fontSize="20px">
          Particle post-processor script
        </Pane>
        <CodeMirror
          value={code}
          height="500px"
          extensions={[rust()]}
          theme={githubDark}
          onChange={onChange}
        />
        <Pane
          marginBottom="10px"
          marginTop="25px"
          alignItems="center"
          justifyContent="center"
          className={styles.actionPanel}
        >
          <div className={styles.testPanel}>
            <Input
              value={testCid}
              onChange={(e) => seTestCid(e.target.value)}
              placeholder="Enter particle CID to apply script...."
            />
            <Button onClick={onSave}>Test</Button>
          </div>
          {isChanged && <Button onClick={onSave}>Save</Button>}
        </Pane>
        <textarea value={log} className="resize-none" rows={18} />
      </main>
    </div>
  );
}

export default ScriptEditor;
