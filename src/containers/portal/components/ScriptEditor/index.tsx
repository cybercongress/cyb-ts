import React, { useCallback, useState, useEffect } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { MainContainer } from '..';
import { ContainerGradientText } from 'src/components';
// import Tooltip from 'src/components/tooltip/tooltip';
import { rust } from '@codemirror/lang-rust';
import { scriptItemStorage, runScript } from 'src/services/scripting/engine';

function ScriptEditor() {
  const [log, setLog] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
    // console.log('value:', value, viewUpdate);
  }, []);

  const onSave = () => {
    console.log('----onsave', code);
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
      console.log('----result', result);
      const msg = result.diagnosticsOutput
        ? `Error:\r\n${result.diagnosticsOutput}`
        : 'Success';
      setLog(msg);
    });
  };

  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        {/* <Tooltip tooltip="Compile and save"> */}
        <button type="button" onClick={() => onSave()}>
          Compile&Save
        </button>
        {/* </Tooltip> */}
        <CodeMirror
          value={code}
          height="500px"
          extensions={[rust()]}
          // theme={dracula}
          theme="dark"
          onChange={onChange}
        />
        <textarea value={log} className="resize-none" rows={18} />
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ScriptEditor;
