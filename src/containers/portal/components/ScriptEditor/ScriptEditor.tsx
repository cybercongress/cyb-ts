import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';

import { RootState } from 'src/redux/store';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';

import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { Pane } from '@cybercongress/gravity';
import {
  Button,
  Input,
  ContainerGradientText,
  ButtonIcon,
} from 'src/components';

import { ScriptEntrypoint, ScriptExecutionResult } from 'src/types/scripting';
import { useSigningClient } from 'src/contexts/signerClient';
import { getTextFromIpfsContent } from 'src/services/scripting/helpers';
import { addContenToIpfs, getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import { isCID } from 'src/utils/ipfs/helpers';
import {
  setEntrypoint,
  setEntrypointEnabled,
} from 'src/redux/features/scripting';

import Switch from 'src/components/Switch/Switch';

import { Controlled as CodeMirror } from 'react-codemirror2';
import ActionBarContainer from 'src/components/actionBar';
import {
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
} from 'src/utils/localStorage';
import back from 'src/image/arrow-left-img.svg';

import { updatePassportParticle } from '../../utils';

import { compileScript } from './utils';

// import defaultParticleScript from 'src/services/scripting/rune/default/particle.rn';

import styles from './ScriptEditor.module.scss';
import 'codemirror/mode/rust/rust';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
// import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/theme/the-matrix.css';
import './CodeMirror.scss';

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

function StepsBar({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: React.ReactNode[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  const onBack = () => setCurrentStep(currentStep - 1);

  return (
    <div className={styles.stepsPanel}>
      {!!currentStep && (
        <ButtonIcon img={back} onClick={onBack} text="previous step" />
      )}
      {steps[currentStep]}
    </div>
  );
}

function ScriptingActionBar({
  isChanged,
  addToLog,
  onSaveClick,
  codeMirrorRef,
  code,
  nickname,
  resetPlayGround,
}: {
  isChanged: boolean;
  addToLog: (log: string[]) => void;
  onSaveClick: () => void;
  codeMirrorRef: React.MutableRefObject<CodeMirror | undefined>;
  code: string;
  nickname: string;
  resetPlayGround: () => void;
}) {
  const { node } = useIpfs();
  const [testCid, seTestCid] = useState('');

  const [actionBarStep, setActionBarStep] = useState(0);

  const onTestMoonDomainClick = async () => {
    resetPlayGround();
    addToLog([`🚧 Execute your 'moon_domain_resolver'.`]);

    compileScript(code, {
      execute: true,
      funcName: 'moon_domain_resolver',
      funcParams: {},
    })
      .then((result) => {
        formatExecutionResult(result, codeMirrorRef, addToLog);
      })
      .finally(() => {
        setActionBarStep(0);
      });
  };

  const onTestClick = async () => {
    resetPlayGround();
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
    const funcParams = {
      cid: testCid,
      contentType,
      content,
    };

    compileScript(code, {
      execute: true,
      funcName: 'personal_processor',
      funcParams,
    }).then((result) => {
      formatExecutionResult(result, codeMirrorRef, addToLog);
    });
  };

  const onTestPersonalProcessorClick = () => setActionBarStep(1);
  const actionBarSteps = [
    <div key="step_0" className={styles.stepWrapper}>
      <Button
        onClick={onTestMoonDomainClick}
      >{`test ${nickname}.moon resolver`}</Button>
      <Button onClick={onTestPersonalProcessorClick}>
        test personal processor
      </Button>
      <Button onClick={console.log}>reset to default</Button>
    </div>,
    <div key="step_1" className={styles.stepWrapper}>
      <Input
        value={testCid}
        onChange={(e) => seTestCid(e.target.value)}
        placeholder="Enter particle CID to apply script...."
      />
      <Button onClick={onTestClick}>Test particle processor</Button>
    </div>,
  ];

  return (
    <ActionBarContainer
      button={isChanged ? { text: 'save', onClick: onSaveClick } : undefined}
      // additionalButtons={[{ text: 'reset to default', onClick: console.log }]}
    >
      <Pane className={styles.actionPanel}>
        <StepsBar
          steps={actionBarSteps}
          currentStep={actionBarStep}
          setCurrentStep={(value) => setActionBarStep(value)}
        />
      </Pane>
    </ActionBarContainer>
  );
}

const entrypointName = 'particle';

function ScriptEditor() {
  const dispatch = useAppDispatch();

  const codeMirrorRef = useRef<CodeMirror>();
  const { signer, signingClient } = useSigningClient();
  const { [entrypointName]: currentEntrypoint } = useAppSelector(
    (store: RootState) => store.scripting.scripts.entrypoints
  );

  const { defaultAccount } = useAppSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [code, setCode] = useState<string>(currentEntrypoint.script || '');

  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState(true);

  // const loadScript = async () => {
  //   const cid = passport?.extension.particle;
  //   console.log('loadScript', cid);

  //   if (!cid || !isCID(cid)) {
  //     setCode(
  //       loadStringFromLocalStorage(entrypointName, defaultParticleScript)
  //     );
  //     // setIsEnabled(false);
  //     console.log('loadScript noIpfs', currentEntrypoint);
  //     dispatch(setEntrypointEnabled({ name: entrypointName, enabled: false }));
  //   } else {
  //     const response = await getIPFSContent(node, cid);
  //     const content =
  //       response?.contentType === 'text' && response?.result
  //         ? await getTextFromIpfsContent(response.result)
  //         : undefined;
  //     setCode(content || defaultParticleScript);

  //     console.log('loadScript myParticle fromIpfs', content, response);
  //     dispatch(
  //       setEntrypointEnabled({ name: entrypointName, enabled: !!content })
  //     );
  //   }

  //   setIsLoaded(true);
  // };

  const saveScriptToPassport = async (scriptCode: string) => {
    const cid = await addContenToIpfs(node, scriptCode);
    console.log('saveScriptToPassport', cid, scriptCode);
    addToLog(['🏁 Saving to passport...']);
    if (cid) {
      updatePassportParticle(passport?.extension.nickname, cid, {
        signer,
        signingClient,
      })
        .then((result) => {
          addToLog(['', `☑️ Saved as particle into your passport.`]);
        })
        .catch((error) => {
          addToLog(['', `🚫 Particle was not saved: ${error}.`]);
        });
    }
  };

  const saveScript = async () => {
    try {
      addToLog(['Saving code...']);
      setIsLoaded(false);
      saveStringToLocalStorage(entrypointName, code);
      if (!currentEntrypoint.enabled) {
        addToLog(['', '☑️ Saved to local storage.']);
      } else {
        await saveScriptToPassport(code);
      }

      dispatch(setEntrypoint({ name: entrypointName, code }));
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    resetPlayGround();
    setCode(currentEntrypoint.script);
  }, [currentEntrypoint]);

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
    resetPlayGround();
    if (!code) {
      addToLog([`🚫 Can't save empty code`]);
      return;
    }

    compileScript(code, {
      execute: false,
    }).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      highlightErrors(codeMirrorRef.current, result.diagnostics);

      if (!isOk) {
        addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);
      } else {
        addToLog(['🏁 Compiled - OK.']);
        // dispatch(setScript({ name: entrypointName, code }));
        saveScript();
        setIsChanged(false);
      }
    });
  };

  const changeScriptEnabled = async (isOn: boolean) => {
    setIsLoaded(false);
    saveScriptToPassport(isOn ? code : '')
      .then(() => {
        dispatch(
          setEntrypointEnabled({
            name: entrypointName,
            enabled: isOn,
          })
        );
      })
      .finally(() => {
        setIsLoaded(true);
      });
  };

  if (!signer || !signingClient) {
    return (
      <ContainerGradientText>Wallet is not connected.</ContainerGradientText>
    );
  }

  if (!passport) {
    return (
      <ContainerGradientText>
        Passport required, for this action.
      </ContainerGradientText>
    );
  }

  return (
    <>
      <ContainerGradientText>
        <div>
          <div className={styles.settingsPanel}>
            <Switch
              isOn={currentEntrypoint.enabled}
              onToggle={changeScriptEnabled}
              label={<div>Soul enabled</div>}
            />
          </div>

          <CodeMirror
            ref={codeMirrorRef}
            editorDidMount={(editor) => {
              editor.setSize('', '450px');
            }}
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

          <textarea value={logText} className={styles.logArea} rows={18} />
        </div>
      </ContainerGradientText>
      <ScriptingActionBar
        isChanged={isChanged}
        onSaveClick={onSaveClick}
        code={code}
        codeMirrorRef={codeMirrorRef}
        resetPlayGround={resetPlayGround}
        addToLog={addToLog}
        nickname={passport.extension.nickname}
      />
    </>
  );
}

export default ScriptEditor;
