import React from 'react';
import { ContainerGradient } from '../components';
import ContainerAvatar from '../components/avataIpfs/containerAvatar';

function Avatar({ txs, valueNickname, avatar }) {
  return (
    <ContainerGradient txs={txs} title="Moon Citizenship">
      <div
        style={{
          paddingLeft: '15px',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ color: '#36D6AE' }}>{valueNickname}</div>

        <ContainerAvatar>{avatar}</ContainerAvatar>
      </div>
    </ContainerGradient>
  );
}

export default Avatar;
