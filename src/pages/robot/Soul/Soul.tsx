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
import { ContainerGradientText } from 'src/components';

import { useSigningClient } from 'src/contexts/signerClient';

import {
  setEntrypoint,
  setEntrypointEnabled,
} from 'src/redux/reducers/scripting';

import Switch from 'src/components/Switch/Switch';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { saveStringToLocalStorage } from 'src/utils/localStorage';

import { updatePassportParticle } from 'src/services/neuron/neuronApi';

import ScriptingActionBar from './ScriptingActionBar/ScriptingActionBar';

// import 'codemirror/theme/tomorrow-night-bright.css';
// import 'codemirror/theme/the-matrix.css';

// import { extractRuneContent } from 'src/services/scripting/helpers';
import { useBackend } from 'src/contexts/backend/backend';

import defaultParticleScript from 'src/services/scripting/rune/default/particle.rn';

// import 'codemirror/mode/rust/rust';
import './formatting/rune';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';

import './codeMirror.css';
import styles from './Soul.module.scss';

const entrypointName = 'particle';

const highlightErrors = (
  codeMirrorRef: React.Ref<CodeMirror>,
  diagnostics: any[],
  styles: Record<string, string>
) => {
  const cm = codeMirrorRef!.editor;

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

function Soul() {
  const dispatch = useAppDispatch();
  const { ipfsApi, rune } = useBackend();

  const codeMirrorRef = useRef<CodeMirror>();
  const outputRef = useRef();

  const { signer, signingClient } = useSigningClient();

  const { [entrypointName]: currentEntrypoint } = useAppSelector(
    (store: RootState) => store.scripting.scripts.entrypoints
  );

  const { defaultAccount } = useAppSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [log, setLog] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [code, setCode] = useState<string>('');

  const [isLoaded, setIsLoaded] = useState(true);
  const addToLog = useCallback(
    (lines: string[]) => setLog((log) => [...log, ...lines]),
    []
  );

  const compileAndTest = async (funcName: string, funcParams = []) => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });

    addToLog([`🚧 Execute your '${funcName}'.`]);
    rune
      ?.run(code, {
        execute: true,
        funcName,
        funcParams,
      })
      .then((result) => {
        const isOk = !result.diagnosticsOutput && !result.error;
        highlightErrors(codeMirrorRef!.current, result.diagnostics, styles);
        if (!isOk) {
          console.log('----res', result);
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
      });
  };

  const saveScriptToPassport = async (scriptCode: string) => {
    addToLog(['⚓️ Saving to IPFS ...']);
    const cid = await ipfsApi?.addContent(scriptCode);
    // console.log('saveScriptToPassport', cid, scriptCode);
    addToLog([`🏁 Saving '${cid}' to passport ...`]);
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

  const saveScript = async (script: string) => {
    try {
      addToLog(['Saving code...']);
      setIsLoaded(false);

      // const combinedScript = `${markdown}\r\n\`\`\`rune\r\n${script}\r\n\`\`\``;

      saveStringToLocalStorage(entrypointName, script);

      if (!currentEntrypoint.enabled) {
        addToLog(['', '☑️ Saved to local storage.']);
        dispatch(setEntrypoint({ name: entrypointName, code: script }));
      } else {
        await saveScriptToPassport(script);
        dispatch(setEntrypoint({ name: entrypointName, code: script }));
      }
    } finally {
      setIsLoaded(true);
      setIsChanged(false);
    }
  };

  // const saveBio = async (newBio: string) => {
  //   setBio(newBio);
  //   await saveScript(code, newBio);
  // };

  const onResetToDefault = async () => {
    addToLog(['Resetting to default...']);
    setIsLoaded(false);
    setIsChanged(false);
    setCode(defaultParticleScript);
    // setBio(defaultBio);
    await saveScript(defaultParticleScript);
  };

  useEffect(() => {
    // resetPlayGround();
    // const { script, markdown } = extractRuneContent(currentEntrypoint.script);
    setCode(currentEntrypoint.script || defaultParticleScript);
    // setBio(markdown);
  }, [currentEntrypoint]);

  const logText = useMemo(() => log.join('\r\n'), [log]);

  const resetPlayGround = () => setLog([]);

  const onCancelClick = () => {
    resetPlayGround();
    setIsChanged(false);
    setCode(currentEntrypoint.script);
  };

  const onSaveClick = () => {
    resetPlayGround();
    if (!code) {
      addToLog([`🚫 Can't save empty code`]);
      return;
    }
    rune
      ?.run(code, {
        execute: false,
      })
      .then((result) => {
        if (result.diagnosticsOutput || result.error) {
          addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);

          highlightErrors(codeMirrorRef.current, result.diagnostics, styles);
        } else {
          addToLog(['🏁 Compiled - OK.']);
          saveScript(code);
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
    <ContainerGradientText>
      <div>
        <div className={styles.settingsPanel}>
          <Switch
            value={currentEntrypoint.enabled}
            onChange={changeScriptEnabled}
            label="cybscript enabled"
          />
        </div>

        <CodeMirror
          ref={codeMirrorRef}
          editorDidMount={(editor) => {
            editor.setSize('', '400px');
          }}
          value={code}
          options={{
            readOnly: !isLoaded,
            mode: 'rune',
            theme: 'tomorrow-night-eighties',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
            setIsChanged(true);
          }}
        />

        <textarea
          ref={outputRef}
          value={logText}
          className={styles.logArea}
          rows={18}
        />
      </div>
      <ScriptingActionBar
        isChanged={isChanged}
        onSaveClick={onSaveClick}
        onCancelClick={onCancelClick}
        resetPlayGround={resetPlayGround}
        addToLog={addToLog}
        nickname={passport.extension.nickname}
        resetToDefault={onResetToDefault}
        compileAndTest={compileAndTest}
      />
    </ContainerGradientText>
  );
}

export default Soul;
