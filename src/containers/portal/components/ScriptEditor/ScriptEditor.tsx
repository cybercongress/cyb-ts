import React, { useCallback, useState, useMemo } from 'react';

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
  ScriptParticleParams,
} from 'src/services/scripting/engine';
import { useSigningClient } from 'src/contexts/signerClient';
import {
  getIpfsTextContent,
  getTextFromIpfsContent,
} from 'src/services/scripting/helpers';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { useIpfs } from 'src/contexts/ipfs';
import styles from './ScriptEditor.module.scss';

import { MainContainer } from '..';
import { updatePassportData } from '../../utils';

const compileScript = (
  code: string,
  executeAfterCompile: boolean,
  particle?: ScriptParticleParams
) =>
  runScript(
    code,
    {
      particle,
    },
    scriptItemStorage.particle.runtime,
    undefined,
    executeAfterCompile
  );

function ScriptEditor() {
  const { signer, signingClient } = useSigningClient();
  const { node } = useIpfs();

  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [testCid, seTestCid] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);

  const logText = useMemo(() => log.join('\r\n'), [log]);

  const addToLog = useCallback(
    (lines: string[]) => setLog((log) => [...log, ...lines]),
    []
  );

  // useEffect(() => {
  //   setCode(passport?.extension.data || scriptItemStorage.particle.user);
  // }, [passport]);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
    setIsChanged(true);
  }, []);

  const onTestClick = async () => {
    setLog([]);

    addToLog(['Prepare data....', '', `Fetching particle '${testCid}'`]);
    const response = await getIPFSContent(node, testCid);
    const contentType = detectContentType(response?.meta.mime);

    const content =
      contentType === 'text' && response?.result
        ? await getTextFromIpfsContent(response.result)
        : '';

    const preview =
      content.length > 144 ? `${content.slice(1, 144)}....` : content;

    addToLog([
      '',
      'Done:',
      `   Content-type: ${contentType}`,
      `    Preview: ${preview}`,
      '',
      'Execute script....',
    ]);
    const particleParams = {
      cid: testCid,
      contentType,
      content,
    };

    compileScript(code, true, particleParams).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      console.log('-----res', result);
      if (!isOk) {
        addToLog(['Errors:', `   ${result.diagnosticsOutput}`]);
      } else {
        addToLog([
          '',
          '----------------------------',
          '',
          'Result:',
          '',
          `   ${JSON.stringify(result.result)}`,
        ]);
      }
    });
  };

  const onSaveClick = () => {
    setLog([]);

    compileScript(code, false).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      if (!isOk) {
        addToLog(['Errors:', `   ${result.diagnosticsOutput}`]);
      } else {
        addToLog(['Compiled!']);
      }

      saveScript('particle', code);
      setIsChanged(false);
      addToLog(['', 'Saved to local storage.']);
    });
  };

  if (!signer || !signingClient) {
    return <Pane>Wallet is not connected.</Pane>;
  }

  if (!passport) {
    return <Pane>Passport required, for this action.</Pane>;
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
            <Button onClick={onTestClick}>Test</Button>
          </div>
          {isChanged && <Button onClick={onSaveClick}>Save</Button>}
        </Pane>
        <textarea value={logText} className="resize-none" rows={18} />
      </main>
    </div>
  );
}

export default ScriptEditor;
