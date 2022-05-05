import React from 'react';
import { ContainerGradient } from '../components';

function Rules() {
  return (
    <ContainerGradient styleLampContent="red" title="Moon Citizenship rules">
      <div style={{ paddingLeft: '15px', height: '100%' }}>
        <ol
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <li>Always remember your keys </li>
          <li>Never give your keys to anyone </li>
          <li>Learn to trust your keys to apps </li>
          <li>Always verify your keys </li>
          <li>Consider how to inherit your keys</li>
        </ol>
      </div>
    </ContainerGradient>
  );
}

export default Rules;
