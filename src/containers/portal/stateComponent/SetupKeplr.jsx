import React from 'react';
import { ContainerGradient } from '../components';

const linkMovie =
  'https://gateway.ipfs.cybernode.ai/ipfs/QmW99p83AGb3Qa62iL6B24RNLcwRh9x9U2nqkF94dfvuze';

function SetupKeplr() {
  return (
    <ContainerGradient
      userStyleContent={{ height: '350px' }}
      title="How to setup Keplr"
    >
      <div
        style={{
          width: '100%',
          background: 'transparent',
          position: 'relative',
          height: '100%',
        }}
      >
        <video width="100%" height="100%" controls>
          <source src={linkMovie} type="video/mp4" />
        </video>
      </div>
    </ContainerGradient>
  );
}

export default SetupKeplr;
