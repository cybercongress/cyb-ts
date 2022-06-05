import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

const CONSTITUTION_HASH = 'QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV';
// const CONTRACT_ADDRESS_GIFT =
//   'bostrom1t3f4zxve6725sf4glrnlar8uku78j0nyfl0ppzgfju9ft9phvqwqcqau6f';
const CONTRACT_ADDRESS_GIFT =
  'bostrom1fkwjqyfdyktgu5f59jpwhvl23zh8aav7f98ml9quly62jx2sehys3xeq0u';
const CONTRACT_ADDRESS =
  'bostrom1fzm6gzyccl8jvdv3qq6hp9vs6ylaruervs4m06c7k0ntzn2f8faq7ha2z2';
// const CONTRACT_ADDRESS =
//   'bostrom15hzg7eaxgs6ecn46gmu4juc9tau2w45l9cnf8n0797nmmtkdv7jscv88ra';

const DICTIONARY = {
  Astronauts: 'Astronaut',
  'Average Citizens. ETH Analysis': 'Average Citizens',
  'Cyberpunks. ERC20 and ERC721 Analysis': 'Cyberpunk',
  'Extraordinary Hackers. Gas Analysis': 'Extraordinary Hacker',
  'Key Opinion Leaders. ERC20 Analysis': 'Key Opinion Leader',
  'Masters of the Great Web. Gas and ERC721 Analysis':
    'Master of the Great Web',
  'Passionate Investors. ERC20 Analysis': 'Passionate Investor',
  'Heroes of the Great Web. Genesis and ETH2 Stakers':
    'True Heroe of the Great Web',
  Leeches: 'Devil',
};

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
      }
    };
    getActivePassport();
  }, [addressActive, jsCyber, updateFunc]);

  return { citizenship, loading, setLoading };
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

const parseValue = (data) => {
  if (data.length > 0) {
    const newData = data.replace(/'/g, '"');
    return JSON.parse(newData);
  }
  return null;
};

const parseValueDetails = (data) => {
  const value = parseValue(data);
  if (value !== null) {
    const details = {};
    value.forEach((item) => {
      details[DICTIONARY[item.audience]] = { gift: item.gift };
    });
    return details;
  }
  return null;
};

const parseResponse = (obj) => {
  return {
    ...obj,
    details: parseValueDetails(obj.details),
    proof: parseValue(obj.proof),
  };
};

const checkGift = async (address) => {
  try {
    const response = await axios({
      method: 'GET',
      // url: `https://titan.cybernode.ai/graphql/api/rest/get-cybergift/${address}`,
      url: `https://titan.cybernode.ai/graphql/api/rest/get-test-gift/${address}`,
    });

    if (response && response.data) {
      const { data } = response;
      // if (
      //   Object.prototype.hasOwnProperty.call(data, 'cyber_gift_proofs') &&
      //   Object.keys(data.cyber_gift_proofs).length > 0
      // ) {
      //   const { cyber_gift_proofs: cyberGiftData } = data;
      //   return parseResponse(cyberGiftData[0]);
      // }
      if (
        Object.prototype.hasOwnProperty.call(data, 'test_gift') &&
        Object.keys(data.test_gift).length > 0
      ) {
        const { test_gift: cyberGiftData } = data;
        return parseResponse(cyberGiftData[0]);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

const queryContractSmartPassport = async (client, query) => {
  try {
    const response = await client.queryContractSmart(CONTRACT_ADDRESS, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const queryContractSmartGift = async (client, query) => {
  try {
    const response = await client.queryContractSmart(
      CONTRACT_ADDRESS_GIFT,
      query
    );
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getStateGift = async (client) => {
  try {
    const query = {
      state: {},
    };
    const response = await queryContractSmartGift(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getConfigGift = async (client) => {
  try {
    const query = {
      config: {},
    };
    const response = await queryContractSmartGift(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getReleaseState = async (client, address) => {
  try {
    const query = {
      release_state: {
        address,
      },
    };
    const response = await queryContractSmartGift(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getClaimedAmount = async (client, address) => {
  try {
    const query = {
      claim: {
        address,
      },
    };
    const response = await queryContractSmartGift(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getIsClaimed = async (client, address) => {
  try {
    const query = {
      is_claimed: {
        address,
      },
    };
    const response = await queryContractSmartGift(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const getPassportByNickname = async (client, nickname) => {
  try {
    const query = {
      passport_by_nickname: {
        nickname,
      },
    };
    const response = await queryContractSmartPassport(client, query);
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
  checkGift,
  getConfigGift,
  getStateGift,
  getReleaseState,
  getClaimedAmount,
  getIsClaimed,
  getPassportByNickname,
};
