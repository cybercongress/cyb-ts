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

function PasportCitizenship({ citizenship, txHash, node, updateFunc }) {
  const [owner, setOwner] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (updateFunc) {
      if (
        addresses !== null &&
        Object.prototype.hasOwnProperty.call(addresses, active)
      ) {
        updateFunc(addresses[active].address);
      } else {
        updateFunc(null);
      }
    }
  }, [addresses, active, updateFunc]);

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
        setAddresses([{ address: citizenship.owner }, ...addressesData]);
      }
    };
    getPasport();
  }, [citizenship]);

  const addressActiveSignatures = useMemo(() => {
    if (
      addresses !== null &&
      Object.prototype.hasOwnProperty.call(addresses, active)
    ) {
      return { bech32: addresses[active].address };
    }
    return null;
  }, [addresses, active]);

  const useClosedTitle = useMemo(() => {
    if (citizenship !== null) {
      return (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            zIndex: '1',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#36D6AE' }}>
            {citizenship !== null && citizenship.extension.nickname}
          </div>

          <div style={{ width: '32px', height: '32px' }}>
            <AvataImgIpfs
              cidAvatar={citizenship.extension.avatar}
              node={node}
            />
          </div>
        </div>
      );
    }
    return null;
  }, [citizenship, node]);

  return (
    <ContainerGradient
      txs={txHash}
      closedTitle={useClosedTitle}
      title="Moon Citizenship"
    >
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
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(PasportCitizenship);
