import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';

import { RootState } from 'src/redux/store';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useLocation, useParams } from 'react-router-dom';

import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { Tablist } from '@cybercongress/gravity';
import { ContainerGradientText, TabBtn } from 'src/components';

import { useSigningClient } from 'src/contexts/signerClient';
import { addContenToIpfs } from 'src/utils/ipfs/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import {
  setEntrypoint,
  setEntrypointEnabled,
} from 'src/redux/features/scripting';

import Switch from 'src/components/Switch/Switch';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { saveStringToLocalStorage } from 'src/utils/localStorage';

import { updatePassportParticle } from '../../utils';

import { compileScript, highlightErrors, changeUrlLastPath } from './utils';

import BioEditor2 from './BioEditor2/BioEditor2';

import { MilkdownProvider } from '@milkdown/react';

import ScriptingActionBar from './ScriptingActionBar/ScriptingActionBar';

import defaultParticleScript from 'src/services/scripting/rune/default/particle.rn';

// import 'codemirror/mode/rust/rust';
import './formatting/rune';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
// import 'codemirror/theme/tomorrow-night-bright.css';
// import 'codemirror/theme/the-matrix.css';
import './CodeMirror.css';
import styles from './ScriptEditor.module.scss';
import { extractRuneContent } from 'src/services/scripting/helpers';

const SOUL_TABS = { script: 'cybscript', bio: 'bio' };
const defaultBio =
  'Hello, _##name##_!\r\nYou can fill any info about yourself using **markdown**.';

const entrypointName = 'particle';

function ScriptEditor() {
  const dispatch = useAppDispatch();
  const location = useLocation();

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
  const [bio, setBio] = useState<string>('');

  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState(true);
  const { tab } = useParams();

  const addToLog = useCallback(
    (lines: string[]) => setLog((log) => [...log, ...lines]),
    []
  );

  const compileAndTest = async (funcName: string, funcParams = {}) => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });

    addToLog([`🚧 Execute your '${funcName}'.`]);

    compileScript(code, {
      execute: true,
      funcName,
      funcParams,
    }).then((result) => {
      const isOk = !result.diagnosticsOutput && !result.error;
      highlightErrors(codeMirrorRef.current, result.diagnostics, styles);
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
    });
  };

  const saveScriptToPassport = async (scriptCode: string) => {
    addToLog(['⚓️ Saving to IPFS ...']);
    const cid = await addContenToIpfs(node, scriptCode);
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

  const saveScript = async (script: string, markdown: string) => {
    try {
      addToLog(['Saving code...']);
      setIsLoaded(false);

      const combinedScript = `${markdown}\r\n\`\`\`rune\r\n${script}\r\n\`\`\``;

      saveStringToLocalStorage(entrypointName, combinedScript);
      if (!currentEntrypoint.enabled) {
        addToLog(['', '☑️ Saved to local storage.']);
      } else {
        await saveScriptToPassport(combinedScript);
      }

      dispatch(setEntrypoint({ name: entrypointName, code: combinedScript }));
    } finally {
      setIsLoaded(true);
      setIsChanged(false);
    }
  };

  const saveBio = async (newBio: string) => {
    setBio(newBio);
    await saveScript(code, newBio);
  };

  const onResetToDefault = async () => {
    addToLog(['Resetting to default...']);
    setIsLoaded(false);
    setCode(defaultParticleScript);
    setBio(defaultBio);
    await saveScript(defaultParticleScript, defaultBio);
  };

  useEffect(() => {
    // resetPlayGround();
    console.log('currentEntrypoint', currentEntrypoint);
    const { script, markdown } = extractRuneContent(currentEntrypoint.script);
    setCode(script || defaultParticleScript);
    setBio(markdown);
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

    compileScript(code, {
      execute: false,
    }).then((result) => {
      if (result.diagnosticsOutput || result.error) {
        addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);

        highlightErrors(codeMirrorRef.current, result.diagnostics, styles);
      } else {
        addToLog(['🏁 Compiled - OK.']);

        saveScript(code, bio);
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
      <Tablist
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
        gridGap="10px"
        marginBottom={25}
        width="100%"
        marginX="auto"
      >
        {Object.keys(SOUL_TABS).map((key) => (
          <TabBtn
            key={`tab_script_${key}`}
            text={SOUL_TABS[key]}
            isSelected={tab === key}
            to={changeUrlLastPath(location.pathname, key)}
          />
        ))}
      </Tablist>

      {tab === 'script' && (
        <>
          <div>
            <div className={styles.settingsPanel}>
              <Switch
                isOn={currentEntrypoint.enabled}
                onToggle={changeScriptEnabled}
                label={<div>cybscript enabled</div>}
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
            node={node}
            compileAndTest={compileAndTest}
          />
        </>
      )}
      {tab === 'bio' && (
        <MilkdownProvider>
          <BioEditor2
            bio={
              bio || defaultBio.replace('##name##', passport.extension.nickname)
            }
            onSave={(m) => saveBio(m)}
          />
        </MilkdownProvider>
      )}
    </ContainerGradientText>
  );
}

export default ScriptEditor;
