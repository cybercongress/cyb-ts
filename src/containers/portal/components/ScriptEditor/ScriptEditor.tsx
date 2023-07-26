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
import {
  Button,
  Input,
  TabBtn,
  MainContainer,
  ContainerGradientText,
} from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';

// import {
//   ScriptEntrypointName,
//   ScriptExecutionResult,
//   ScriptEntrypoint,
// } from 'src/services/scripting/scritpting';
import {
  ScriptEntrypoint,
  ScriptExecutionResult,
  ScriptEntrypointNames,
} from 'src/types/scripting';
import { useSigningClient } from 'src/contexts/signerClient';
import { getTextFromIpfsContent } from 'src/services/scripting/helpers';
import { addContenToIpfs, getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { useIpfs } from 'src/contexts/ipfs';
import { isCID } from 'src/utils/ipfs/helpers';
import { setScript } from 'src/redux/features/scripting';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { updatePassportParticle } from '../../utils';

import { compileScript } from './utils';
import styles from './ScriptEditor.module.scss';

import 'codemirror/mode/rust/rust';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
import Secrets from './Secrets/Secrets';

import {
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
} from 'src/utils/localStorage';

import { scriptMap } from 'src/services/scripting/scripts/mapping';

// import 'codemirror/theme/tomorrow-night-bright.css';
// import 'codemirror/theme/the-matrix.css';
import Carousel from '../../../temple/components/corusel/index';

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
  result: ScriptExecutionResult,
  codeMirrorRef: React.MutableRefObject<CodeMirror | undefined>,
  addToLog: (items: string[]) => void
) => {
  const isOk = !result.diagnosticsOutput && !result.error;
  highlightErrors(codeMirrorRef.current, result.diagnostics);
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
  entrypoint: ScriptEntrypoint;
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
    const contentType = response?.contentType; // detectContentType(response?.meta.mime);

    const content =
      contentType === 'text' && response?.result
        ? await getTextFromIpfsContent(response.result)
        : '';

    const preview =
      content.length > 144 ? `${content.slice(1, 144)}....` : content;

    addToLog([
      `   ☑️ Content-type: ${contentType || '???'}`,
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
  entrypoint: ScriptEntrypoint;
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
    scripts: { entrypoints },
  } = useSelector((store: RootState) => store.scripting);

  const [entrypointName, setEntrypointName] = useState<ScriptEntrypointNames>(
    Object.keys(entrypoints)[0] as ScriptEntrypointNames
  );

  const { tab = entrypointName } = useParams();

  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [code, setCode] = useState<string>(
    entrypoints[tab as ScriptEntrypointNames]?.user || ''
  );
  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState(false);

  const loadScript = async () => {
    const alreadyLoaded = entrypoints[entrypointName]?.user;
    // workaround to fix pre-cached passport cid
    if (alreadyLoaded) {
      setCode(alreadyLoaded);
      return;
    }

    if (entrypointName === 'particle') {
      setCode(
        loadStringFromLocalStorage(entrypointName, scriptMap.particle.user)
      );
    }
    if (entrypointName === 'myParticle') {
      const cid = passport?.extension.particle;
      if (!cid || !isCID(cid)) {
        setCode(scriptMap.myParticle.user);
      } else {
        const response = await getIPFSContent(node, cid);
        const content =
          response?.contentType === 'text' && response?.result
            ? await getTextFromIpfsContent(response.result)
            : undefined;
        setCode(
          content || content === '' ? content : scriptMap.myParticle.user
        );
      }
    }

    setIsLoaded(true);
  };

  const saveScript = async () => {
    addToLog(['Saving code...']);
    setIsLoaded(false);
    if (entrypointName === 'particle') {
      saveStringToLocalStorage('particle', code);
      addToLog(['', '☑️ Saved to local storage.']);
    }
    if (entrypointName === 'myParticle') {
      const cid = await addContenToIpfs(node, code);

      if (cid) {
        const result = await updatePassportParticle(
          passport?.extension.nickname,
          cid,
          {
            signer,
            signingClient,
          }
        );
        addToLog(['', `☑️ Saved as particle into your passport.`]);
      }
    }

    dispatch(setScript({ name: entrypointName, code }));
    setIsLoaded(true);
  };

  useEffect(() => {
    if (Object.keys(entrypoints).indexOf(tab as ScriptEntrypointNames) > -1) {
      const newEntrypoint = tab as ScriptEntrypointNames;
      setEntrypointName(newEntrypoint);
      // setCode(entrypoints[newEntrypoint]?.user || '');
    }
  }, [tab]);

  useEffect(() => {
    resetPlayGround();
    setCode('Loading script...');
    loadScript();
  }, [entrypointName, passport]);

  const logText = useMemo(() => log.join('\r\n'), [log]);

  const addToLog = useCallback(
    (lines: string[]) => setLog((log) => [...log, ...lines]),
    []
  );

  // useEffect(() => {
  //   setCode(passport?.extension.data || ScriptEntrypointStorage.particle.user);
  // }, [passport]);

  const resetPlayGround = () => setLog([]);

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
        // dispatch(setScript({ name: entrypointName, code }));
        saveScript();
        setIsChanged(false);
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
      {/* <MainContainer> */}
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
              text={entrypoints[k as ScriptEntrypointNames].title}
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

        {/* <Carousel
          slides={Object.keys(entrypoints).map((k) => ({
            title: entrypoints[k as ScriptEntrypointName].title.toLocaleLowerCase(),
          }))}
          setStep={(i) => {
            console.log(i);
          }}
          activeStep={Object.keys(entrypoints).indexOf(tab as ScriptEntrypointName)}
        /> */}
        {tab === 'secrets' && <Secrets />}
        {!tab ||
          (Object.keys(entrypoints).indexOf(tab) > -1 && (
            <>
              <ContainerGradientText>
                <CodeMirror
                  ref={codeMirrorRef}
                  value={code}
                  options={{
                    readOnly: !isLoaded,
                    mode: 'rust',
                    theme: 'tomorrow-night-eighties',
                    lineNumbers: true,
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setCode(value);
                    setIsChanged(true);
                  }}
                />
              </ContainerGradientText>
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
                {entrypointName === 'myParticle' && (
                  <PlayMyParticle
                    reset={resetPlayGround}
                    addToLog={addToLog}
                    codeMirrorRef={codeMirrorRef}
                    code={code}
                    entrypoint={entrypoints[entrypointName]}
                  />
                )}
                {isChanged && <Button onClick={onSaveClick}>Save</Button>}
              </Pane>
              <textarea value={logText} className={styles.logArea} rows={18} />
            </>
          ))}
      </main>
      {/* </MainContainer> */}
    </div>
  );
}

export default ScriptEditor;
