import { Controlled as CodeMirror } from 'react-codemirror2';

import './formatting/rune';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/tomorrow-night-eighties.css';

import './formatting/codeMirror.css';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useBackend } from 'src/contexts/backend/backend';
import { Option } from 'src/types';
import styles from './RuneIde.module.scss';

const highlightErrors = (
  codeMirror: CodeMirror,
  diagnostics: any[],
  styles: Record<string, string>
) => {
  const cm = codeMirror!.editor;

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

type RuneIdeProps = {
  runeCode: string;
  readOnly: boolean;
  onChange?: (code: string) => void;
};

export type RuneIdeHandle = {
  test: (funcName: string, funcParams: any[]) => Promise<boolean>;
  save: () => Promise<Option<string>>;
  putToLog: (items: string[]) => void;
  clearLog: () => void;
};

const RuneIde = forwardRef<RuneIdeHandle, RuneIdeProps>(
  ({ runeCode, readOnly, onChange }, ref) => {
    const codeMirrorRef = useRef<CodeMirror | null>(null);
    const outputRef = useRef<HTMLTextAreaElement | null>(null);
    const { rune } = useBackend();

    const [code, setCode] = useState<string>('');
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
      setCode(runeCode);
      clearLog();
      // setIsChanged(false);
    }, [runeCode]);

    const addToLog = useCallback(
      (lines: string[]) => setLog((log) => [...log, ...lines]),
      []
    );

    const test = async (funcName: string, funcParams: any[] = []) => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth' });

      addToLog([`🚧 Execute your '${funcName}'.`]);
      return rune
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

          return isOk;
        });
    };

    const save = async () => {
      clearLog();
      if (!code) {
        addToLog([`🚫 Can't save empty code`]);
        return undefined;
      }

      return rune
        ?.run(code, {
          execute: false,
        })
        .then((result) => {
          if (result.diagnosticsOutput || result.error) {
            addToLog(['⚠️ Errors:', `   ${result.diagnosticsOutput}`]);

            highlightErrors(codeMirrorRef.current, result.diagnostics, styles);
            return undefined;
          }
          addToLog(['🏁 Compiled - OK.']);
          // onSave(code);
          return code;
        });
    };

    const logText = useMemo(() => log.join('\r\n'), [log]);

    const clearLog = () => setLog([]);

    useImperativeHandle(ref, () => ({
      test,
      save,
      putToLog: addToLog,
      clearLog,
    }));

    return (
      <div className={styles.wrapper}>
        <CodeMirror
          ref={codeMirrorRef}
          editorDidMount={(editor) => {
            editor.setSize('', '400px');
          }}
          value={code}
          options={{
            readOnly,
            mode: 'rune',
            theme: 'tomorrow-night-eighties',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
            onChange && onChange(value);
          }}
        />

        <textarea
          ref={outputRef}
          value={logText}
          className={styles.logArea}
          rows={18}
        />
      </div>
      // <ScriptingActionBar
      //   isChanged={isChanged}
      //   onSaveClick={onSaveClick}
      //   onCancelClick={onCancelClick}
      //   resetPlayGround={resetPlayGround}
      //   addToLog={addToLog}
      //   nickname={passport.extension.nickname}
      //   resetToDefault={onResetToDefault}
      //   compileAndTest={compileAndTest}
      // />
    );
  }
);

RuneIde.displayName = 'RuneIde';
export default RuneIde;
