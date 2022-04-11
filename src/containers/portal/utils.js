import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context';

const CONSTITUTION_HASH = 'QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV';
const CONTRACT_ADDRESS_GIFT =
  'bostrom1ppaqu7q47xgzx0ykwtgcmjazh74pqw3zw57w93zrrznu3lgluq0qyxq48n';
const CONTRACT_ADDRESS =
  'bostrom1g59m935w4kxmtfx5hhykre7w9q497ptp66asspz76vhgarss5ensdy35s8';
// const CONTRACT_ADDRESS =
//   'bostrom15hzg7eaxgs6ecn46gmu4juc9tau2w45l9cnf8n0797nmmtkdv7jscv88ra';

const COUNT_STAGES = 10;

const GIFT_ICON = '🎁';
const BOOT_ICON = '🟢';

const useGetActivePassport = (addressActive, updateFunc) => {
  const { jsCyber } = useContext(AppContext);
  const [citizenship, setCitizenship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getActivePassport = async () => {
      setLoading(true);
      if (addressActive !== null && jsCyber !== null) {
        try {
          const query = {
            active_passport: {
              address: addressActive.bech32,
            },
          };
          const response = await jsCyber.queryContractSmart(
            CONTRACT_ADDRESS,
            query
          );
          setCitizenship(response);
          setLoading(false);
        } catch (error) {
          setCitizenship(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getActivePassport();
  }, [addressActive, jsCyber, updateFunc]);

  return { citizenship, loading };
};

const activePassport = async (client, address) => {
  try {
    const query = {
      active_passport: {
        address,
      },
    };
    const response = await client.queryContractSmart(CONTRACT_ADDRESS, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

export {
  activePassport,
  CONTRACT_ADDRESS,
  useGetActivePassport,
  CONSTITUTION_HASH,
  CONTRACT_ADDRESS_GIFT,
  GIFT_ICON,
  BOOT_ICON,
  COUNT_STAGES,
};
