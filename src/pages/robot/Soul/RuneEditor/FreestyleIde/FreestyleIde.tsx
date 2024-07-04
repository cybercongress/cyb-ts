import { useRef, useState, useCallback } from 'react';
import { useBackend } from 'src/contexts/backend/backend';
import RuneCode, { RuneCodeHandle } from '../RuneCode/RuneCode';
import RuneOutput, { RuneOutputHandle } from '../RuneOutput/RuneOutput';
import {
  ActionBar,
  Button,
  ContainerGradientText,
  DisplayTitle,
} from 'src/components';
import defaultAiScript from 'src/services/scripting/rune/default/ai.rn';
import defaultPlaygroundScript from 'src/services/scripting/rune/default/playground.rn';
import styles from './Freestyle.module.scss';

function FreestyleIde() {
  const libCodeRef = useRef<RuneCodeHandle | null>(null);
  const outputRef = useRef<RuneOutputHandle | null>(null);
  const testCodeRef = useRef<RuneCodeHandle | null>(null);

  const { rune } = useBackend();

  const [libCode, setLibCode] = useState<string>(defaultAiScript);
  const [testCode, setTestCode] = useState<string>(defaultPlaygroundScript);
  const clearLog = () => outputRef.current?.clear();

  const test = async (funcName: string, funcParams: any[] = []) => {
    outputRef.current?.scrollIntoView();

    outputRef.current?.put([`🚧 Execute your '${funcName}'.`]);
    return rune
      ?.run(libCode, {
        execute: true,
        funcName,
        funcParams,
      })
      .then((result) => {
        const isOk = !result.diagnosticsOutput && !result.error;
        libCodeRef.current?.highlightErrors(result.diagnostics);
        if (!isOk) {
          outputRef.current?.put([
            '⚠️ Errors:',
            `   ${result.diagnosticsOutput}`,
          ]);
        } else {
          outputRef.current?.put(
            [
              '🏁 Result:',
              `   ${JSON.stringify(result.result)}`,
              '🧪 Raw output:',
              result?.output || 'no output.',
            ],
            '\r\n'
          );
        }

        return isOk;
      });
  };

  const save = async () => {
    clearLog();
    if (!libCode) {
      outputRef.current?.put([`🚫 Can't save empty code`]);
      return undefined;
    }

    return rune
      ?.run(libCode, {
        execute: false,
      })
      .then((result) => {
        if (result.diagnosticsOutput || result.error) {
          outputRef.current?.put([
            '⚠️ Errors:',
            `   ${result.diagnosticsOutput}`,
          ]);
          libCodeRef.current?.highlightErrors(result.diagnostics);
          return undefined;
        }
        outputRef.current?.put(['🏁 Compiled - OK.']);
        return libCode;
      });
  };

  const setRuneCode = useCallback((code: string) => {
    setLibCode(code);
  }, []);

  return (
    <>
      <main className="block-body">
        <ContainerGradientText title={<DisplayTitle title="IDE" />}>
          <div className={styles.header}>library code</div>
          <RuneCode
            ref={libCodeRef}
            code={libCode}
            size="400px"
            onChange={(code) => setLibCode(code)}
          />
          <div className={styles.header}>playground</div>
          <RuneCode
            ref={testCodeRef}
            code={testCode}
            size="200px"
            onChange={(code) => setTestCode(code)}
          />
          <div className={styles.header}>output</div>
          <RuneOutput ref={outputRef} />
        </ContainerGradientText>
      </main>
      <ActionBar>
        <Button>Run</Button>
        <Button>Save</Button>
      </ActionBar>
    </>
  );
}

export default FreestyleIde;
