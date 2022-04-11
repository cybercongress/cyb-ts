import React, { useEffect, useState, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { useGetActivePassport, CONTRACT_ADDRESS_GIFT } from '../utils';
import PasportCitizenship from '../pasport';
import ActionBarPortalGift from './ActionBarPortalGift';
import { CurrentGift } from '../components';

import testDataJson from './test.json';

const all = require('it-all');
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayToAsciiString = require('uint8arrays/to-string');
const FileType = require('file-type');

const cid = 'QmZqMHgfAe4rB6GLDQcEtWgrZmQTsXZ4hTieuD1ULo9vX1';

function PortalGift({ defaultAccount, node }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { citizenship } = useGetActivePassport(addressActive, updateFunc);
  const [currentGift, setCurrentGift] = useState(null);
  const [isClaimed, setIsClaimed] = useState(null);
  const [isRelease, setIsRelease] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            setUpdateFunc((item) => item + 1);
            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: response.rawLog.toString(),
            }));
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  useEffect(() => {
    if (selectedAddress !== null) {
      if (Object.prototype.hasOwnProperty.call(testDataJson, selectedAddress)) {
        setCurrentGift(testDataJson[selectedAddress]);
        checkClaim();
      } else {
        setCurrentGift(null);
        setIsClaimed(null);
      }
    } else {
      setCurrentGift(null);
      setIsClaimed(null);
    }
  }, [selectedAddress, updateFunc]);

  const checkClaim = useCallback(async () => {
    if (selectedAddress !== null && jsCyber !== null) {
      const queryResponseResult = await jsCyber.queryContractSmart(
        CONTRACT_ADDRESS_GIFT,
        {
          is_claimed: {
            address: selectedAddress,
          },
        }
      );
      if (
        queryResponseResult &&
        Object.prototype.hasOwnProperty.call(queryResponseResult, 'is_claimed')
      ) {
        console.log(
          'queryResponseResult.is_claimed',
          queryResponseResult.is_claimed
        );
        setIsClaimed(queryResponseResult.is_claimed);
        if (queryResponseResult.is_claimed) {
          setIsRelease(true);
        }
      }
    } else {
      setIsClaimed(null);
    }
  }, [selectedAddress, jsCyber]);

  // const useCheckRelease = useCallback(async () => {
  //   try {
  //     if (selectedAddress !== null && jsCyber !== null) {
  //       const queryResponseResultRelease = await jsCyber.queryContractSmart(
  //         CONTRACT_ADDRESS_GIFT,
  //         {
  //           release_state: {
  //             address: selectedAddress,
  //           },
  //         }
  //       );
  //       console.log('queryResponseResultRelease', queryResponseResultRelease);
  //       if (
  //         queryResponseResultRelease !== null &&
  //         Object.prototype.hasOwnProperty.call(
  //           queryResponseResultRelease,
  //           'stage_expiration'
  //         )
  //       ) {
  //         const {
  //           stage_expiration: stageExpiration,
  //           stage,
  //         } = queryResponseResultRelease;
  //         // if (stage === 0) {
  //         //   setIsRelease(true);
  //         // }
  //         if (Object.prototype.hasOwnProperty.call(stageExpiration, 'never')) {
  //           setIsRelease(true);
  //         } else {
  //           setIsRelease(true);
  //         }
  //           // setIsRelease(true);

  //       }
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     setIsRelease(null);
  //   }
  // }, [selectedAddress, jsCyber]);

  // useEffect(() => {
  //   const checkClaim = async () => {
  //     if (selectedAddress !== null && jsCyber !== null) {
  //       const queryResponseResult = await jsCyber.queryContractSmart(
  //         CONTRACT_ADDRESS_GIFT,
  //         {
  //           is_claimed: {
  //             address: 'cosmos1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjw9mextn',
  //           },
  //         }
  //       );
  //       console.log('queryResponseResult', queryResponseResult);

  //       const queryResponseResultRelease = await jsCyber.queryContractSmart(
  //         CONTRACT_ADDRESS_GIFT,
  //         {
  //           release_state: {
  //             address: 'cosmos1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjw9mextn',
  //           },
  //         }
  //       );
  //       console.log('queryResponseResultRelease', queryResponseResultRelease)
  //     }
  //   };
  //   checkClaim();
  // }, [selectedAddress]);

  // useEffect(() => {
  //   const checkGift = async () => {
  //     if (node !== null) {
  //       const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

  //       const dataFileType = await FileType.fromBuffer(responseCat);
  //       if (dataFileType === undefined) {
  //         const dataBase64 = uint8ArrayToAsciiString(responseCat);
  //         console.log('dataBase64', JSON.parse(dataBase64));
  //       }
  //     }
  //   };
  //   checkGift();
  // }, [node]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  console.log('citizenship', citizenship);
  console.log('currentGift', currentGift);

  let content;

  if (citizenship !== null) {
    content = (
      <>
        <main
          style={{ minHeight: 'calc(100vh - 162px)' }}
          className="block-body"
        >
          <div
            style={{
              width: '60%',
              margin: '0px auto',
              display: 'grid',
              gap: '20px',
            }}
          >
            <PasportCitizenship
              txHash={txHash}
              citizenship={citizenship}
              updateFunc={setSelectedAddress}
            />

            <CurrentGift currentGift={currentGift} />
            {/* {currentGift !== null && (

            )} */}
          </div>
        </main>
        <ActionBarPortalGift
          // updateFunc={() => setUpdateFunc((item) => item + 1)}
          citizenship={citizenship}
          updateTxHash={updateTxHash}
          isClaimed={isClaimed}
          selectedAddress={selectedAddress}
          currentGift={currentGift}
          isRelease={isRelease}
        />
      </>
    );
  }

  return <>{content}</>;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(PortalGift);
