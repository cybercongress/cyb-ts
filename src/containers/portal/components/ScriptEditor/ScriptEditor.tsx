import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from 'src/redux/store';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { Pane, Tablist } from '@cybercongress/gravity';
import { Button, Input, ContainerGradientText, TabBtn } from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';

import {
  ScriptEntrypoint,
  ScriptExecutionData,
  ScriptItem,
  ScriptParticleParams,
} from 'src/services/scripting/scritpting';
import { useSigningClient } from 'src/contexts/signerClient';
import { getTextFromIpfsContent } from 'src/services/scripting/helpers';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { useIpfs } from 'src/contexts/ipfs';
import { isCID } from 'src/utils/ipfs/helpers';
import { setSecrets, setScript } from 'src/redux/features/scripting';
import { appBus } from 'src/services/scripting/bus';
// import { updatePassportData } from '../../utils';
import { keyValuesToObject } from 'src/utils/localStorage';
import { TabularKeyValues } from 'src/types/data';

import EditableTable from 'src/components/EditableTable/EditableTable';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { compileScript } from './utils';
import styles from './ScriptEditor.module.scss';

import 'codemirror/mode/rust/rust';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
// import 'codemirror/theme/tomorrow-night-bright.css';
// import 'codemirror/theme/the-matrix.css';

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

const formatExecutionResult = (
  result: ScriptExecutionData,
  codeMirrorRef: React.MutableRefObject<CodeMirror | undefined>,
  addToLog: (items: string[]) => void
) => {
  const isOk = !result.diagnosticsOutput && !result.error;
  highlightErrors(codeMirrorRef.current, result.diagnostics);
  console.log('----res', result);
  if (!isOk) {
    addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);
  } else {
    addToLog([
      '',
      '🏁 Result:',
      '',
      `   ${JSON.stringify(result.result)}`,
      '',
      '🧪 Raw output:',
      '',
      result?.output || 'no output.',
    ]);
  }
};

function PlayParticlePostProcessor({
  addToLog,
  codeMirrorRef,
  code,
  entrypoint,
  reset,
}: {
  addToLog: (log: string[]) => void;
  codeMirrorRef: React.MutableRefObject<CodeMirror | undefined>;
  code: string;
  entrypoint: ScriptItem;
  reset: () => void;
}) {
  const { node } = useIpfs();
  const [testCid, seTestCid] = useState('');
  const onTestClick = async () => {
    reset();
    if (!isCID(testCid)) {
      addToLog([`🚫 '${testCid}' - is not correct CID.`]);
      return;
    }
    addToLog([
      '💡 Prepare data....',
      '',
      `🚧 Fetching particle '${testCid}'...`,
    ]);
    const response = await getIPFSContent(node, testCid);
    const contentType = detectContentType(response?.meta.mime);

    const content =
      contentType === 'text' && response?.result
        ? await getTextFromIpfsContent(response.result)
        : '';

    const preview =
      content.length > 144 ? `${content.slice(1, 144)}....` : content;

    addToLog([
      `   ☑️ Content-type: ${contentType}`,
      `   ☑️ Preview: ${preview}`,
      '',
      '💭 Execute script....',
    ]);
    const particle = {
      cid: testCid,
      contentType,
      content,
    };

    compileScript(code, entrypoint.runtime, true, {
      particle,
    }).then((result) => {
      formatExecutionResult(result, codeMirrorRef, addToLog);
    });
  };

  return (
    <div className={styles.testPanel}>
      <Input
        value={testCid}
        onChange={(e) => seTestCid(e.target.value)}
        placeholder="Enter particle CID to apply script...."
      />
      <Button onClick={onTestClick}>Test</Button>
    </div>
  );
}

function PlayMyParticle({
  addToLog,
  codeMirrorRef,
  code,
  entrypoint,
  reset,
}: {
  addToLog: (log: string[]) => void;
  codeMirrorRef: React.MutableRefObject<CodeMirror | undefined>;
  code: string;
  entrypoint: ScriptItem;
  reset: () => void;
}) {
  const [testInput, seTestInput] = useState('');
  const onTestClick = async () => {
    reset();
    const myParticle = {
      input: testInput,
    };

    compileScript(code, entrypoint.runtime, true, {
      myParticle,
    }).then((result) => {
      formatExecutionResult(result, codeMirrorRef, addToLog);
    });
  };

  return (
    <div className={styles.testPanel}>
      <Input
        value={testInput}
        onChange={(e) => seTestInput(e.target.value)}
        placeholder="Enter commander input..."
      />
      <Button onClick={onTestClick}>Test</Button>
    </div>
  );
}

function ScriptEditor() {
  const dispatch = useDispatch();

  const codeMirrorRef = useRef<CodeMirror>();
  const { signer, signingClient } = useSigningClient();
  const {
    secrets,
    scripts: { entrypoints },
  } = useSelector((store: RootState) => store.scripting);

  const [entrypointName, setEntrypointName] = useState<ScriptEntrypoint>(
    Object.keys(entrypoints)[0] as ScriptEntrypoint
  );

  const { tab = entrypointName } = useParams();

  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [code, setCode] = useState<string>(
    entrypoints[tab as ScriptEntrypoint]?.user
  );

  useEffect(() => {
    if (Object.keys(entrypoints).indexOf(tab as ScriptEntrypoint) > -1) {
      const newEntrypoint = tab as ScriptEntrypoint;
      setEntrypointName(newEntrypoint);
      setCode(entrypoints[newEntrypoint]?.user);
    }
  }, [tab, entrypoints]);

  const logText = useMemo(() => log.join('\r\n'), [log]);

  const addToLog = useCallback(
    (lines: string[]) => setLog((log) => [...log, ...lines]),
    []
  );

  // useEffect(() => {
  //   setCode(passport?.extension.data || scriptItemStorage.particle.user);
  // }, [passport]);

  const resetPlayGround = () => setLog([]);

  const onSaveSecrets = (secrets: TabularKeyValues) => {
    dispatch(setSecrets(secrets));
  };

  const onSaveClick = () => {
    setLog([]);
    if (!code) {
      addToLog([`🚫 Can't save empty code`]);
      return;
    }

    compileScript(
      code,
      entrypoints[entrypointName].runtime,
      false,
      undefined
    ).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      highlightErrors(codeMirrorRef.current, result.diagnostics);

      if (!isOk) {
        addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);
      } else {
        addToLog(['🏁 Compiled!']);
        dispatch(setScript({ name: entrypointName, code }));
        setIsChanged(false);
        addToLog(['', '☑️ Saved to local storage.']);
      }
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
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
          gridGap="10px"
          marginTop={25}
          marginBottom={50}
          width="100%"
          marginX="auto"
        >
          {Object.keys(entrypoints).map((k) => (
            <TabBtn
              key={`tab_${k}`}
              text={entrypoints[k as ScriptEntrypoint].title}
              isSelected={tab === k}
              to={`/plugins/${k}`}
            />
          ))}
          <TabBtn
            text="Secrets"
            isSelected={tab === 'secrets'}
            to="/plugins/secrets"
          />
        </Tablist>
        {tab === 'secrets' && (
          <EditableTable
            data={secrets}
            columns={['key', 'value']}
            onSave={onSaveSecrets}
          />
        )}
        {!tab ||
          (Object.keys(entrypoints).indexOf(tab) > -1 && (
            <>
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
                {entrypointName === 'particle' && (
                  <PlayParticlePostProcessor
                    reset={resetPlayGround}
                    addToLog={addToLog}
                    codeMirrorRef={codeMirrorRef}
                    code={code}
                    entrypoint={entrypoints[entrypointName]}
                  />
                )}
                {entrypointName === 'my-particle' && (
                  <PlayMyParticle
                    reset={resetPlayGround}
                    addToLog={addToLog}
                    codeMirrorRef={codeMirrorRef}
                    code={code}
                    entrypoint={entrypoints[entrypointName]}
                  />
                )}
                {/* <div className={styles.testPanel}>
                <Input
                  value={testCid}
                  onChange={(e) => seTestCid(e.target.value)}
                  placeholder="Enter particle CID to apply script...."
                />
                <Button onClick={onTestClick}>Test</Button>
              </div> */}
                {isChanged && <Button onClick={onSaveClick}>Save</Button>}
              </Pane>
              <textarea value={logText} className={styles.logArea} rows={18} />
            </>
          ))}
      </main>
    </div>
  );
}

export default ScriptEditor;