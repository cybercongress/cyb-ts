import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

const CONSTITUTION_HASH = 'QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV';

// test root
// const CONTRACT_ADDRESS_GIFT =
//   'bostrom1fkwjqyfdyktgu5f59jpwhvl23zh8aav7f98ml9quly62jx2sehys3xeq0u';

// prod root
const CONTRACT_ADDRESS_GIFT =
  'bostrom1hz2lvf367zjmlwe65lgskhuxjntyl08z7yutsunzc8wha4f66mvs5nsmtx';

// test root
// const CONTRACT_ADDRESS_PASSPORT =
//   'bostrom1fzm6gzyccl8jvdv3qq6hp9vs6ylaruervs4m06c7k0ntzn2f8faq7ha2z2';

// prod root
const CONTRACT_ADDRESS_PASSPORT =
  'bostrom1mypljhatv0prfr9cjzzvamxdf2ctg34xkt50sudxads9zhqnynequc66y5';

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
    'True Hero of the Great Web',
  Leeches: 'Devil',
};

const COUNT_STAGES = 10;

const GIFT_ICON = '🎁';
const BOOT_ICON = '🟢';

const useGetActivePassport = (addressActive, updateFunc) => {
  const { jsCyber } = useContext(AppContext);
  const [citizenship, setCitizenship] = useState(null);
  const [loading, setLoading] = useState(true);

  const useGetActiveAddress = useMemo(() => {
    const { account } = addressActive;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32, name } = account.cyber;
      addressPocket = {
        bech32,
        keys,
      };

      if (name) {
        addressPocket.name = name;
      }
    }
    return addressPocket;
  }, [addressActive]);

  useEffect(() => {
    const getActivePassport = async () => {
      setLoading(true);
      if (jsCyber !== null) {
        if (useGetActiveAddress !== null) {
          setLoading(true);
          try {
            const query = {
              active_passport: {
                address: useGetActiveAddress.bech32,
              },
            };
            const response = await jsCyber.queryContractSmart(
              CONTRACT_ADDRESS_PASSPORT,
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
      }
    };
    getActivePassport();
  }, [useGetActiveAddress, jsCyber, updateFunc]);

  return { citizenship, loading, setLoading };
};

const activePassport = async (client, address) => {
  try {
    const query = {
      active_passport: {
        address,
      },
    };
    const response = await client.queryContractSmart(
      CONTRACT_ADDRESS_PASSPORT,
      query
    );
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
      url: `https://titan.cybernode.ai/graphql/api/rest/get-cybergift/${address}`, // prod root
      // url: `https://titan.cybernode.ai/graphql/api/rest/get-test-gift/${address}`, // test root
    });

    if (response && response.data) {
      const { data } = response;
      if (
        Object.prototype.hasOwnProperty.call(data, 'cyber_gift_proofs') &&
        Object.keys(data.cyber_gift_proofs).length > 0
      ) {
        const { cyber_gift_proofs: cyberGiftData } = data;
        return parseResponse(cyberGiftData[0]);
      }
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
    const response = await client.queryContractSmart(
      CONTRACT_ADDRESS_PASSPORT,
      query
    );
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

const getNumTokens = async (client) => {
  try {
    const query = {
      num_tokens: {},
    };
    const response = await queryContractSmartPassport(client, query);
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const tooMuthAddressError =
  'failed to execute message; message index: 0: Address is not eligible to claim airdrop, Too many addresses: execute wasm contract failed';

const canProve8AddressNewError =
  'You can prove only 8 addresses for one passport';

const parseRowLog = (rawlog) => {
  if (rawlog === tooMuthAddressError) {
    return canProve8AddressNewError;
  }

  return rawlog;
};

export {
  activePassport,
  CONTRACT_ADDRESS_PASSPORT,
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
  parseRowLog,
  getNumTokens,
};
