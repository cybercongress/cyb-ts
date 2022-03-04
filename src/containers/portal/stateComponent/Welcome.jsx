import React from 'react';
import { ContainerGradient } from '../components';

function Welcome() {
  return (
    <ContainerGradient title="Welcome to Immigration!">
      <div
        style={{
          textAlign: 'center',
          padding: '10px 50px 0px 50px',
          gap: 20,
          display: 'grid',
        }}
      >
        <div>My name is Cyb.</div>
        <div>I can help you to recieve Moon Citizenship in 7 simple steps.</div>
        <div>Also I have a gift for you if you tried hard!</div>
      </div>
    </ContainerGradient>
  );
}

export default Welcome;
