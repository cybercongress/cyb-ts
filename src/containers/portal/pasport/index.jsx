import { useEffect, useState, useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useIpfs from 'src/hooks/useIpfs';
import { Signatures, ParseAddressesImg } from '../components';
import { AppContext } from '../../../context';
import { AvataImgIpfs } from '../components/avataIpfs';
import ContainerAvatar from '../components/avataIpfs/containerAvatar';
import { formatNumber, trimString } from '../../../utils/utils';
import { PATTERN_CYBER } from '../../../utils/config';
import BtnPasport from './btnPasport';
import plus from '../../../image/plus.svg';
import { ContainerGradient } from '../../../components';

function PasportCitizenship({
  citizenship,
  txHash,
  updateFunc,
  stateOpen,
  initStateCard,
  setActiveItem,
  totalGift,
  onClickDeleteAddress,
  onClickProveeAddress,
  onClickEditAvatar,
}) {
  const { node } = useIpfs();
  const { jsCyber } = useContext(AppContext);
  const [owner, setOwner] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [active, setActive] = useState(0);
  const [karma, setKarma] = useState(0);

  useEffect(() => {
    if (setActiveItem !== undefined) {
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

  // const useGetOwner

  useEffect(() => {
    const getKarma = async () => {
      try {
        if (owner !== null && owner.match(PATTERN_CYBER) && jsCyber !== null) {
          const responseKarma = await jsCyber.karma(owner);
          if (responseKarma.karma) {
            setKarma(parseFloat(responseKarma.karma));
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    getKarma();
  }, [owner, jsCyber]);

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
    if (addresses !== null) {
      if (Object.prototype.hasOwnProperty.call(addresses, active)) {
        return { bech32: addresses[active].address };
      }
      setActive(0);
      return { bech32: addresses[0].address };
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
          <div style={{ color: '#00C4FF' }}>
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

  const checkClaimedAddress = (itemAddress, totalGiftArr) => {
    const statusAddress = {
      gift: false,
      claimed: false,
    };

    if (
      totalGiftArr &&
      totalGiftArr !== null &&
      Object.prototype.hasOwnProperty.call(totalGiftArr, itemAddress)
    ) {
      statusAddress.gift = true;
      const giftByAddress = totalGiftArr[itemAddress];
      if (giftByAddress.isClaimed) {
        statusAddress.claimed = true;
      }
    }

    return statusAddress;
  };

  const renderItemImg = useMemo(() => {
    if (addresses !== null) {
      return addresses.map((item, index) => {
        const key = uuidv4();
        const statusAddressGiftData = checkClaimedAddress(
          item.address,
          totalGift
        );

        return (
          <ParseAddressesImg
            key={key}
            address={item}
            active={index === active}
            onClick={() => setActive(index)}
            statusAddressGift={statusAddressGiftData}
          />
        );
      });
    }

    return [];
  }, [active, addresses, totalGift]);

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
          <div style={{ lineHeight: '18px' }}>
            karma {karma > 0 ? formatNumber(karma) : ''} 🔮
          </div>
          <ContainerAvatar>
            <AvataImgIpfs
              cidAvatar={
                citizenship !== null ? citizenship.extension.avatar : false
              }
              node={node}
            />
            {onClickEditAvatar && (
              <BtnPasport onClick={onClickEditAvatar} typeBtn="blue">
                edit
              </BtnPasport>
            )}
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
            <div style={{ position: 'relative' }}>
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
              {active === 0 && onClickProveeAddress && (
                <BtnPasport onClick={onClickProveeAddress} typeBtn="blue">
                  <img
                    style={{ width: '13', height: '13px' }}
                    src={plus}
                    alt="plus"
                  />
                </BtnPasport>
              )}
              {active !== 0 && onClickDeleteAddress && (
                <BtnPasport onClick={onClickDeleteAddress} typeBtn="red">
                  X
                </BtnPasport>
              )}
            </div>
            <Signatures addressActive={addressActiveSignatures} />
          </div>
        )}
      </div>
    </ContainerGradient>
  );
}

export default PasportCitizenship;
