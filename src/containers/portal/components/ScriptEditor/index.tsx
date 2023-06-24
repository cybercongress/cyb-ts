import React, { useCallback, useState, useEffect } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';

import { ContainerGradientText } from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';
import { rust } from '@codemirror/lang-rust';
import { scriptItemStorage, runScript } from 'src/services/scripting/engine';
import { useSigningClient } from 'src/contexts/signerClient';

import { MainContainer } from '..';
import { updatePassportData } from '../../utils';

function ScriptEditor() {
  const { signer, signingClient } = useSigningClient();
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);

  useEffect(() => {
    setCode(passport?.extension.data || scriptItemStorage.particle.user);
  }, [passport]);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
    // console.log('value:', value, viewUpdate);
  }, []);

  const onSave = () => {
    runScript(
      code,
      {
        cid: 'QmakRbRoKh5Nss8vbg9qnNN2Bcsr7jUX1nbDeMT5xe8xa1',
        contentType: 'text',
        content: 'dasein.moon',
      },
      scriptItemStorage.particle.runtime,
      undefined,
      true
    ).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      console.log('----result', result, isOk);

      const msg = !isOk ? `Errors:\r\n${result.diagnosticsOutput}` : 'Success!';
      setLog(msg);
      if (isOk) {
        return updatePassportData(passport?.extension.nickname, code, {
          signer,
          signingClient,
        }).then((res) =>
          setLog((log) => `${log}\r\nSaved, tx: ${res.transactionHash}`)
        );
      }
    });
  };

  if (!signer || !signingClient) {
    return <div>Wallet is not connected.</div>;
  }

  if (!passport) {
    return <div>Passport required, for this action.</div>;
  }

  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Particle post-processor script</div>
        <CodeMirror
          value={code}
          height="500px"
          extensions={[rust()]}
          theme={githubDark}
          onChange={onChange}
        />
        {/* <Tooltip tooltip="Compile and save"> */}
        <button
          type="button"
          onClick={() => onSave()}
          style={{ width: 'fit-content', padding: '5px 10px' }}
        >
          Save
        </button>
        {/* </Tooltip> */}
        <textarea
          value={log}
          className="resize-none"
          rows={18}
          style={{
            width: 'calc(100% - 40px)',
          }}
        />
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ScriptEditor;
