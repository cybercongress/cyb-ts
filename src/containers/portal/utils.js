import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context';

const CONSTITUTION_HASH = 'QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV';
const CONTRACT_ADDRESS =
  'bostrom1yx8p96sqhxjkg94tn55za04a9uhjc7m6lkwy606m84wvuxvhe0hqaljtdp';
// const CONTRACT_ADDRESS =
//   'bostrom15hzg7eaxgs6ecn46gmu4juc9tau2w45l9cnf8n0797nmmtkdv7jscv88ra';

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
};
