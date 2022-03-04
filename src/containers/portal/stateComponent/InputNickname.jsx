import React from 'react';
import Input from '../../teleport/components/input';
import { ContainerGradient } from '../components';

function InputNickname({ valueNickname, setValueNickname }) {
  return (
    <ContainerGradient>
      <div style={{ width: '160px' }}>
        <Input
          value={valueNickname}
          onChange={(e) => setValueNickname(e.target.value)}
          placeholder="choose username"
          autoComplete="off"
          textalign="end"
          style={{ fontSize: '16px' }}
        />
      </div>
    </ContainerGradient>
  );
}

export default InputNickname;
