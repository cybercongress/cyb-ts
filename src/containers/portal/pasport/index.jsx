import React, { useEffect, useState, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  ContainerGradient,
  Signatures,
  ParseAddressesImg,
} from '../components';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { activePassport } from '../utils';
import { AvataImgIpfs } from '../components/avataIpfs';
import ContainerAvatar from '../components/avataIpfs/containerAvatar';

function PasportCitizenship({ citizenship, txHash, node }) {
  const [owner, setOwner] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const getPasport = async () => {
      if (citizenship !== null) {
        setOwner(citizenship.owner);
        const addressesData = [];
        if (
          citizenship.extension.addresses &&
          citizenship.extension.addresses.length > 0
        ) {
          addressesData.push(...citizenship.extension.addresses);
        }
        setAddresses([citizenship.owner, ...addressesData]);
      }
    };
    getPasport();
  }, [citizenship]);

  const addressActiveSignatures = useMemo(() => {
    if (
      addresses !== null &&
      Object.prototype.hasOwnProperty.call(addresses, active)
    ) {
      return { bech32: addresses[active] };
    }
    return null;
  }, [addresses, active]);

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
        <ContainerGradient txs={txHash} title="Moon Citizenship">
          <div
            style={{
              height: '100%',
              color: '#36D6AE',
            }}
          >
            <div
              style={{
                display: 'grid',
                height: '50px',
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
            {addresses !== null && (
              <div
                style={{
                  height: 'calc(100% - 50px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  gridGap: '20px',
                }}
              >
                <div style={{ display: 'flex', gridGap: '15px' }}>
                  {addresses.map((item, index) => (
                    <ParseAddressesImg
                      key={item}
                      address={item}
                      active={index === active}
                      onClick={() => setActive(index)}
                    />
                  ))}
                </div>
                <Signatures addressActive={addressActiveSignatures} />
              </div>
            )}
          </div>
        </ContainerGradient>
      </div>
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(PasportCitizenship);
