import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ContainerGradient } from '../components';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { activePassport } from '../utils';
import { AvataImgIpfs } from '../components/avataIpfs';
import ContainerAvatar from '../components/avataIpfs/containerAvatar';

function PasportCitizenship({ defaultAccount, node }) {
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [citizenship, setCitizenship] = useState(null);

  useEffect(() => {
    const getPasport = async () => {
      if (jsCyber !== null && addressActive !== null) {
        const response = await activePassport(jsCyber, addressActive.bech32);
        if (response !== null) {
          console.log('response', response);
          setCitizenship(response);
        }
      }
    };
    getPasport();
  }, [jsCyber, addressActive]);

  return (
    <main className="block-body">
      <div
        style={{
          width: '60%',
          margin: '0px auto',
          display: 'grid',
          gap: '70px',
        }}
      >
        <ContainerGradient title="Moon Citizenship">
          <div
            style={{
              height: '100%',
              color: '#36D6AE',
            }}
          >
            <div
              style={{
                display: 'grid',
                height: '100px',
              }}
            >
              <div style={{ color: '#36D6AE' }}>
                {citizenship !== null && citizenship.extension.nickname}
              </div>
              <ContainerAvatar>
                <AvataImgIpfs
                  cidAvatar={
                    citizenship !== null ? citizenship.extension.avatar : false
                  }
                  node={node}
                />
              </ContainerAvatar>
            </div>
            {/* <Signatures /> */}
          </div>
        </ContainerGradient>
      </div>
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(PasportCitizenship);
