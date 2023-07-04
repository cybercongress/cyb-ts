import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { Pane } from '@cybercongress/gravity';
import { Button, Input } from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';
import {
  scriptItemStorage,
  runScript,
  saveScript,
  ScriptParticleParams,
} from 'src/services/scripting/engine';
import { useSigningClient } from 'src/contexts/signerClient';
import { getTextFromIpfsContent } from 'src/services/scripting/helpers';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { useIpfs } from 'src/contexts/ipfs';
import { isCID } from 'src/utils/ipfs/helpers';

import { Controlled as CodeMirror } from 'react-codemirror2';
import styles from './ScriptEditor.module.scss';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
// import 'codemirror/theme/the-matrix.css';
import 'codemirror/mode/rust/rust';

import { updatePassportData } from '../../utils';

const highlightErrors = (codeMirrorRef, diagnostics) => {
  const cm = codeMirrorRef.editor;

  cm.getAllMarks().forEach((mark) => mark.clear());

  diagnostics.forEach((error) => {
    const { start, end } = error;
    cm.scrollIntoView({ line: start.line, ch: start.character });
    cm.markText(
      { line: start.line, ch: start.character },
      { line: end.line, ch: end.character },
      {
        className: styles.errorHighlight,
        clearOnEnter: true,
      }
    );
  });
};
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
  const codeMirrorRef = useRef();

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

  const onTestClick = async () => {
    setLog([]);
    if (!isCID(testCid)) {
      addToLog([`'${testCid}' - is not correct CID.`]);
      return;
    }
    addToLog(['Prepare data....', '', `Fetching particle '${testCid}'...`]);
    const response = await getIPFSContent(node, testCid);
    const contentType = detectContentType(response?.meta.mime);

    const content =
      contentType === 'text' && response?.result
        ? await getTextFromIpfsContent(response.result)
        : '';

    const preview =
      content.length > 144 ? `${content.slice(1, 144)}....` : content;

    addToLog([
      `   - Content-type: ${contentType}`,
      `   - Preview: ${preview}`,
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
      highlightErrors(codeMirrorRef.current, result.diagnostics);

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
      highlightErrors(codeMirrorRef.current, result.diagnostics);

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
        <Pane marginBottom="25px" fontSize="20px">
          Particle post-processor script
        </Pane>
        <CodeMirror
          ref={codeMirrorRef}
          value={code}
          options={{
            mode: 'rust',
            theme: 'tomorrow-night-eighties',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
            setIsChanged(true);
          }}
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
        <textarea value={logText} className={styles.logArea} rows={18} />
      </main>
    </div>
  );
}

export default ScriptEditor;
