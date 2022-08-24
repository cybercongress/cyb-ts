import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import { ContainerGradient } from '../components';
import { Loading } from '../../../components';

const linkMovie =
  'https://gateway.ipfs.cybernode.ai/ipfs/QmchVARwukqgxU3PA56UTFzkREZc9uFwki1MmCD249yK7S';

function InitKeplr() {

  return (
    <ContainerGradient
      userStyleContent={{ height: '350px' }}
      title="How to install Keplr"
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

export default InitKeplr;
