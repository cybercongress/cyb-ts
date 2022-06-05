import React, { useEffect, useState, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
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
import { trimString } from '../../../utils/utils';

function PasportCitizenship({
  citizenship,
  txHash,
  node,
  updateFunc,
  stateOpen,
  initStateCard,
  setActiveItem,
}) {
  const [owner, setOwner] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (setActiveItem) {
      setActive(setActiveItem);
    }
  }, [setActiveItem]);

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
            height: 32,
          }}
        >
          <div style={{ color: '#36D6AE' }}>
            {citizenship !== null && citizenship.extension.nickname}
          </div>

          <div style={{ color: '#36D6AE' }}>
            {addresses !== null &&
              Object.prototype.hasOwnProperty.call(addresses, active) && (
                <div
                  style={{ display: 'flex', alignItems: 'center', height: 25 }}
                >
                  {trimString(addresses[active].address, 8, 4)}
                  <ParseAddressesImg
                    key={addresses[active].address}
                    address={addresses[active]}
                  />
                </div>
              )}
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
  }, [citizenship, addresses, active, node]);

  const renderItemImg = useMemo(() => {
    if (addresses !== null) {
      return addresses.map((item, index) => {
        const key = uuidv4();
        return (
          <ParseAddressesImg
            key={key}
            address={item}
            active={index === active}
            onClick={() => setActive(index)}
          />
        );
      });
    }

    return [];
  }, [active, addresses]);

  return (
    <ContainerGradient
      txs={txHash}
      closedTitle={useClosedTitle}
      title="Moon Citizenship"
      initState={initStateCard}
      stateOpen={stateOpen}
    >
      <div
        style={{
          height: '100%',
          color: '#36D6AE',
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}
      >
        <div
          style={{
            display: 'grid',
            // height: '60px',
            gap: '20px',
          }}
        >
          <div style={{ color: '#36D6AE', lineHeight: '18px' }}>
            {citizenship !== null && citizenship.extension.nickname}
          </div>
          <div style={{ lineHeight: '18px' }}>karma 🔮 </div>
          <ContainerAvatar>
            <AvataImgIpfs
              cidAvatar={
                citizenship !== null ? citizenship.extension.avatar : false
              }
              node={node}
            />
          </ContainerAvatar>
        </div>
        {addressActiveSignatures !== null && (
          <div
            style={{
              // height: 'calc(100% - 50px)',
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'flex-end',
              gridGap: '10px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: '15.5px',
                gridTemplateColumns: 'repeat(9, 30px)',
                width: '100%',
              }}
            >
              {renderItemImg}
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
