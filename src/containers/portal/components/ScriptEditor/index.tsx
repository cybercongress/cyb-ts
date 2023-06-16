import React, { useCallback, useState, useEffect } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { MainContainer } from '..';
import { ContainerGradientText } from 'src/components';
import Tooltip from 'src/components/tooltip/tooltip';

import { rust } from '@codemirror/lang-rust';
import { scriptItemStorage } from 'src/services/scripting/engine';

function ScriptEditor() {
  const [log, setLog] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);

  const onChange = useCallback((value, viewUpdate) => {
    console.log('value:', value, viewUpdate);
  }, []);
  const onUpdate = () => console.log('onUpdate');

  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        {/* <Tooltip tooltip="Compile and save"> */}
        <button type="button" onClick={onUpdate}>
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
        {!log && <textarea value={log} className="resize-none" />}
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ScriptEditor;
