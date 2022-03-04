const CONTRACT_ADDRESS =
  'bostrom1yx8p96sqhxjkg94tn55za04a9uhjc7m6lkwy606m84wvuxvhe0hqaljtdp';
// const CONTRACT_ADDRESS =
//   'bostrom15hzg7eaxgs6ecn46gmu4juc9tau2w45l9cnf8n0797nmmtkdv7jscv88ra';

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

export { activePassport, CONTRACT_ADDRESS };
