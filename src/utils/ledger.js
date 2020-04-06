import CosmosApp, { getBech32FromPK } from 'ledger-cosmos-js';
import axios from 'axios';
import Big from 'big.js';
import secp256k1 from 'secp256k1';
import txs from './txs';

import { CYBER, LEDGER, COSMOS } from './config';

const {
  CYBER_NODE_URL,
  BECH32_PREFIX_ACC_ADDR_CYBER,
  CYBER_NODE_URL_LCD,
} = CYBER;
const { LEDGER_VERSION_REQ } = LEDGER;
const { BECH32_PREFIX_ACC_ADDR_COSMOS } = COSMOS;

const compareVersion = async ledgerVersion => {
  const test = ledgerVersion;
  const target = LEDGER_VERSION_REQ;
  const testInt = 10000 * test[0] + 100 * test[1] + test[2];
  const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
  return testInt >= targetInt;
};

function wrapError(cdt, e) {
  try {
    // eslint-disable-next-line no-param-reassign
    let errMessage = '';
    if (typeof e.response === 'undefined') {
      errMessage = e.message;
    } else {
      errMessage = e.response.data.error;
    }

    // eslint-disable-next-line no-param-reassign
    cdt.lastError = errMessage;
    return {
      error: errMessage,
    };
  } catch (e2) {
    // eslint-disable-next-line no-param-reassign
    cdt.lastError = `${e.message}  ${e2.message}`;
    return {
      error: `${e.message}  ${e2.message}`,
    };
  }
}

function nodeURL(cdt) {
  if (typeof cdt.resturl === 'undefined' || cdt.resturl === null) {
    throw new Error('Node URL has not been defined');
  }
  return cdt.resturl;
}

class CosmosDelegateTool {
  constructor(transport) {
    // eslint-disable-next-line camelcase
    this.connected = false;
    this.lastError = 'No error';
    this.checkAppInfo = false;
    this.transportDebug = false;
    this.transport = transport;
    // this.resturl = 'https://moon.cybernode.ai';
    this.resturl = 'https://api.chorus.one';
    this.requiredVersionMajor = 1;
    this.requiredVersionMinor = 1;
  }

  // eslint-disable-next-line no-unused-vars
  setNodeURL(resturl) {
    this.resturl = resturl;
  }

  connectedOrThrow(cdt) {
    if (!cdt.connected) {
      this.lastError = 'Device is not connected';
      throw new Error('Device is not connected');
    }
  }

  // Detect when a ledger device is connected and verify the cosmos app is running.
  async connect() {
    this.connected = false;
    this.lastError = null;
    const connectedLog = {
      pin: false,
      app: false,
    };
    this.app = new CosmosApp(this.transport);
    if (this.checkAppInfo) {
      const appInfo = await this.app.appInfo();

      if (appInfo.return_code !== 0x9000) {
        this.lastError = appInfo.error_message;
        return false;
      }
      appInfo.appName = appInfo.appName || '?';
      console.log(`Detected app ${appInfo.appName} ${appInfo.appVersion}`);
      if (appInfo.appName.toLowerCase() !== 'cosmos') {
        this.lastError = `Incorrect app detected ${appInfo.appName.toString()}`;
        return false;
      }
    }
    const version = await this.app.getVersion();
    if (version.return_code === 28160) {
      return version;
    }

    if (version.error_message !== 'No errors') {
      console.log(`Error [${version.error_message}] ${version.error_message}`);
      return;
    }

    if (version.return_code !== 0x9000) {
      this.lastError = version.error_message;
      throw new Error(version.error_message);
    }
    const major = version.major || 0;
    const minor = version.minor || 0;
    if (
      major < this.requiredVersionMajor ||
      minor < this.requiredVersionMinor
    ) {
      this.lastError = 'Version not supported';
      return false;
    }

    // Mark as connected
    this.connected = true;
    connectedLog.pin = true;
    connectedLog.app = true;
    console.log(connectedLog);
    return version;
  }

  // Returns a signed transaction ready to be relayed
  async sign(unsignedTx, txContext) {
    // this.connectedOrThrow(this);
    if (typeof txContext.path === 'undefined') {
      this.lastError = 'context should include the account path';
      throw new Error('context should include the account path');
    }
    // console.log('txContext', txContext);
    const bytesToSign = txs.getBytesToSign(unsignedTx, txContext);
    const response = await this.app.sign(txContext.path, bytesToSign);

    return response;
  }

  async applySignature(signature, unsignedTx, txContext) {
    if (signature.return_code !== LEDGER.LEDGER_OK) {
      this.lastError = signature.error_message;
      throw new Error(signature.return_code, signature.error_message);
    }
    const sig = secp256k1.signatureImport(signature.signature);
    return txs.applySignature(unsignedTx, txContext, sig);
  }

  // Retrieve public key and bech32 address
  async retrieveAddress(path) {
    // this.connectedOrThrow(this);
    // console.log(this.app);
    const pk = await this.app.publicKey(path);
    if (pk.return_code !== 0x9000) {
      this.lastError = pk.error_message;
      throw new Error(pk.error_message);
    }
    return {
      pk: pk.compressed_pk.toString('hex'),
      path,
      bech32: getBech32FromPK(BECH32_PREFIX_ACC_ADDR_COSMOS, pk.compressed_pk),
    };
  }

  async retrieveAddressCyber(path) {
    // this.connectedOrThrow(this);
    // console.log(this.app);
    const pk = await this.app.publicKey(path);
    if (pk.return_code !== 0x9000) {
      this.lastError = pk.error_message;
      throw new Error(pk.error_message);
    }
    return {
      pk: pk.compressed_pk.toString('hex'),
      path,
      bech32: getBech32FromPK(BECH32_PREFIX_ACC_ADDR_CYBER, pk.compressed_pk),
    };
  }

  // Scan multiple address in a derivation path range (44’/118’/X/0/Y)
  // eslint-disable-next-line max-len
  async scanAddresses(minAccount, maxAccount, minIndex, maxIndex) {
    const answer = [];
    for (let account = minAccount; account < maxAccount + 1; account += 1) {
      for (let index = minIndex; index < maxIndex + 1; index += 1) {
        // retrieve address cannot be called in parallel
        // eslint-disable-next-line no-await-in-loop
        const tmp = await this.retrieveAddress(account, index);
        answer.push(tmp);
      }
    }
    return answer;
  }

  async retrieveValidators() {
    const url = `${nodeURL(this)}/staking/validators`;
    return axios.get(url).then(
      r => {
        const validators = {};
        for (let i = 0; i < r.data.length; i += 1) {
          const validatorData = {};
          const t = r.data[i];
          validatorData.tokens = Big(t.tokens);
          validatorData.totalShares = Big(t.delegator_shares);
          validators[t.operator_address] = validatorData;
        }
        return validators;
      },
      e => wrapError(this, e)
    );
  }

  async getAccountInfo(addr) {
    const url = `${nodeURL(this)}/api/cosmos/account/${addr.bech32}`;
    const txContext = {
      sequence: '0',
      accountNumber: '0',
      balanceuAtom: '0',
      chainId: COSMOS.CHAIN_ID,
    };
    return axios.get(url).then(
      r => {
        try {
          console.log('r.data', r.data);
          if (
            typeof r.data !== 'undefined' &&
            typeof r.data.value !== 'undefined'
          ) {
            txContext.sequence = Number(r.data.value.sequence).toString();
            txContext.accountNumber = Number(
              r.data.value.account_number
            ).toString();
            if (r.data.value.coins !== null) {
              const tmp = [];
              tmp.push(r.data.value.coins[0]);
              if (tmp.length > 0) {
                txContext.balanceuAtom = Big(tmp[0].amount).toString();
              }
            }
          }
        } catch (e) {
          console.log('Error ', e, ' returning defaults');
        }
        return txContext;
      },
      e => wrapError(this, e)
    );
  }

  async getAccountInfoCyber(addr) {
    const url = `${CYBER.CYBER_NODE_URL_API}/account?address="${addr.bech32}"`;
    const txContext = {
      sequence: '0',
      accountNumber: '0',
      balanceuAtom: '0',
      chainId: '0',
    };
    return axios.get(url).then(
      r => {
        try {
          console.log('r.data', r.data);
          if (
            typeof r.data !== 'undefined' &&
            typeof r.data.result !== 'undefined'
          ) {
            txContext.sequence = Number(
              r.data.result.account.sequence
            ).toString();
            txContext.accountNumber = Number(
              r.data.result.account.account_number
            ).toString();
            if (r.data.result.account.coins !== null) {
              const tmp = [];
              tmp.push(r.data.result.account.coins[0]);
              if (tmp.length > 0) {
                txContext.balanceuAtom = Big(tmp[0].amount).toString();
              }
            }
          }
        } catch (e) {
          console.log('Error ', e, ' returning defaults');
        }
        return txContext;
      },
      e => wrapError(this, e)
    );
  }

  // async getAccountInfo(addr) {
  //   const url = `${nodeURL(this)}/api/account?address="${addr}"`;
  //   const txContext = {
  //     sequence: '0',
  //     accountNumber: '0',
  //     balanceuAtom: '0',
  //     chainId: 'euler-37'
  //   };
  //   return axios.get(url).then(
  //     r => {
  //       try {
  //         if (
  //           typeof r.data !== 'undefined' &&
  //           typeof r.data.result !== 'undefined'
  //         ) {
  //           txContext.sequence = Number(
  //             r.data.result.account.sequence
  //           ).toString();
  //           txContext.accountNumber = Number(
  //             r.data.result.account.account_number
  //           ).toString();
  //           if (r.data.result.account.coins !== null) {
  //             const tmp = [];
  //             tmp.push(r.data.result.account.coins[0]);
  //             //   debugger;
  //             if (tmp.length > 0) {
  //               txContext.balanceuAtom = Big(tmp[0].amount).toString();
  //             }
  //           }
  //         }
  //       } catch (e) {
  //         console.log('Error ', e, ' returning defaults');
  //       }
  //       return txContext;
  //     },
  //     e => wrapError(this, e)
  //   );
  // }

  async getAccountDelegations(validators, addr) {
    const url = `${nodeURL(this)}/staking/delegators/${
      addr.bech32
    }/delegations`;
    return axios.get(url).then(
      r => {
        const txContext = {
          delegations: {},
          delegationsTotaluAtoms: '0',
        };
        const delegations = {};
        let totalDelegation = Big(0);
        try {
          if (typeof r.data !== 'undefined' && r.data !== null) {
            for (let i = 0; i < r.data.length; i += 1) {
              const t = r.data[i];
              const valAddr = t.validator_address;
              if (valAddr in validators) {
                const shares = Big(t.shares);
                const valData = validators[valAddr];
                const valTokens = valData.tokens;
                const valTotalShares = valData.totalShares;
                const tokens = shares.times(valTokens).div(valTotalShares);
                delegations[valAddr] = {
                  uatoms: tokens.toString(),
                  shares: shares.toString(),
                };
                totalDelegation = totalDelegation.add(tokens);
              }
            }
          }
        } catch (e) {
          console.log('Error ', e, ' returning defaults');
        }
        txContext.delegations = delegations;
        txContext.delegationsTotaluAtoms = totalDelegation.toString();
        return txContext;
      },
      e => wrapError(this, e)
    );
  }

  // Retrieve atom balances from the network for a list of account
  // Retrieve delegated/not-delegated balances for each account
  async retrieveBalances(addressList) {
    const validators = await this.retrieveValidators();
    // Get all balances
    const requestsBalance = addressList.map(async (addr, index) => {
      const txContext = await this.getAccountInfo(addr);
      return { ...addressList[index], ...txContext };
    });
    // eslint-disable-next-line max-len,no-unused-vars
    const requestsDelegations = addressList.map((addr, index) =>
      this.getAccountDelegations(validators, addr)
    );
    // eslint-disable-next-line no-unused-vars,max-len
    const balances = await Promise.all(requestsBalance);
    const delegations = await Promise.all(requestsDelegations);
    const reply = [];
    for (let i = 0; i < addressList.length; i += 1) {
      reply.push({ ...delegations[i], ...balances[i] });
    }
    return reply;
  }

  // Creates a new delegation tx based on the input parameters
  // this function expect that retrieve balances has been called before
  async txCreateDelegate(txContext, validatorBech32, uatomAmount, memo) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    const accountInfo = await this.getAccountInfo(txContext);
    // eslint-disable-next-line no-param-reassign
    txContext.accountNumber = accountInfo.accountNumber;
    // eslint-disable-next-line no-param-reassign
    txContext.sequence = accountInfo.sequence;
    return txs.createDelegate(txContext, validatorBech32, uatomAmount, memo);
  }

  async txCreateDelegateCyber(
    txContext,
    validatorBech32,
    uAmount,
    memo,
    denom
  ) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createDelegateCyber(
      txContext,
      validatorBech32,
      uAmount,
      memo,
      denom
    );
  }

  async txCreateSend(txContext, validatorBech32, uatomAmount, memo) {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    // const accountInfo = await this.getAccountInfo(txContext.bech32);
    // eslint-disable-next-line no-param-reassign
    // txContext.accountNumber = accountInfo.accountNumber;
    // eslint-disable-next-line no-param-reassign
    // txContext.sequence = accountInfo.sequence;
    return txs.createSend(txContext, validatorBech32, uatomAmount, memo);
  }

  async txCreateSendCyber(txContext, addressTo, uatomAmount, memo, demon) {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    // const accountInfo = await this.getAccountInfo(txContext.bech32);
    // eslint-disable-next-line no-param-reassign
    // txContext.accountNumber = accountInfo.accountNumber;
    // eslint-disable-next-line no-param-reassign
    // txContext.sequence = accountInfo.sequence;
    return txs.createSendCyber(txContext, addressTo, uatomAmount, memo, demon);
  }

  async txCreateLink(txContext, address, fromCid, toCid, memo) {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createLink(txContext, address, fromCid, toCid, memo);
  }

  async textProposal(txContext, address, title, description, deposit, memo) {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createTextProposal(
      txContext,
      address,
      title,
      description,
      deposit,
      memo
    );
  }

  withdrawDelegationReward = async (txContext, address, memo, rewards) => {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createWithdrawDelegationReward(
      txContext,
      address,
      memo,
      rewards
    );
  };

  async communityPool(
    txContext,
    address,
    title,
    description,
    recipient,
    deposit,
    amount,
    memo
  ) {
    console.log('txContext', txContext);
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createCommunityPool(
      txContext,
      address,
      title,
      description,
      recipient,
      deposit,
      amount,
      memo
    );
  }

  // Creates a new staking tx based on the input parameters
  // this function expect that retrieve balances has been called before
  async txCreateRedelegate(
    txContext,
    validatorSourceBech32,
    validatorDestBech32,
    uatomAmount,
    memo
  ) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    const accountInfo = await this.getAccountInfo(txContext);
    // eslint-disable-next-line no-param-reassign
    txContext.accountNumber = accountInfo.accountNumber;
    // eslint-disable-next-line no-param-reassign
    txContext.sequence = accountInfo.sequence;
    // Convert from uatoms to shares
    return txs.createRedelegate(
      txContext,
      validatorSourceBech32,
      validatorDestBech32,
      uatomAmount,
      memo
    );
  }

  // Creates a new undelegation tx based on the input parameters
  // this function expect that retrieve balances has been called before
  async txCreateUndelegate(txContext, validatorBech32, uatomAmount, memo) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    const accountInfo = await this.getAccountInfo(txContext);
    // eslint-disable-next-line no-param-reassign
    txContext.accountNumber = accountInfo.accountNumber;
    // eslint-disable-next-line no-param-reassign
    txContext.sequence = accountInfo.sequence;
    return txs.createUndelegate(txContext, validatorBech32, uatomAmount, memo);
  }

  txCreateUndelegateCyber = (txContext, validatorBech32, eulAmount, memo) => {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createUndelegateCyber(
      txContext,
      validatorBech32,
      eulAmount,
      memo
    );
  };

  txCreateRedelegateCyber = (
    txContext,
    validatorSourceBech32,
    validatorDestBech32,
    uatomAmount,
    memo
  ) => {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.bech32 === 'undefined') {
      throw new Error('txContext does not contain the source address (bech32)');
    }
    return txs.createRedelegateCyber(
      txContext,
      validatorSourceBech32,
      validatorDestBech32,
      uatomAmount,
      memo
    );
  };

  importLink = async (txContext, address, links, memo, cli) => {
    if (!cli) {
      if (typeof txContext === 'undefined') {
        throw new Error('undefined txContext');
      }
      if (typeof txContext.bech32 === 'undefined') {
        throw new Error(
          'txContext does not contain the source address (bech32)'
        );
      }
    }
    return txs.createImportLink(txContext, address, links, memo, cli);
  };

  // Relays a signed transaction and returns a transaction hash
  async txSubmit(signedTx) {
    const txBody = {
      tx: signedTx.value,
      mode: 'async',
    };
    const url = 'https://deimos.cybernode.ai/gaia_lcd/txs';
    // const url = 'https://phobos.cybernode.ai/lcd/txs';
    console.log(JSON.stringify(txBody));
    return axios.post(url, JSON.stringify(txBody)).then(
      r => r,
      e => wrapError(this, e)
    );
  }

  async txSubmitCyber(signedTx) {
    const txBody = {
      tx: signedTx.value,
      mode: 'async',
    };
    const url = `${CYBER_NODE_URL_LCD}/txs`;
    // const url = 'https://phobos.cybernode.ai/lcd/txs';
    console.log(JSON.stringify(txBody));
    return axios.post(url, JSON.stringify(txBody)).then(
      r => r,
      e => wrapError(this, e)
    );
  }

  //   async txSubmit(signedTx) {
  //     const txBody = {
  //       tx: signedTx.value
  //     };
  //     // const url = `${nodeURL(this)}/txs`;
  //     const url = 'https://phobos.cybernode.ai/lcd/txs';
  //     return fetch(url, {
  //       method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //       mode: 'cors', // no-cors, cors, *same-origin
  //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //       credentials: 'same-origin', // include, *same-origin, omit
  //       headers: {
  //         'Content-Type': 'application/json;charset=utf-8'
  //       },
  //       redirect: 'follow', // manual, *follow, error
  //       referrer: 'no-referrer', // no-referrer, *client
  //       body: JSON.stringify(txBody) // тип данных в body должен соответвовать значению заголовка "Content-Type"
  //     }).then(r => r, e => wrapError(this, e));
  //   }

  // Retrieve the status of a transaction hash
  async txStatus(txHash) {
    const url = `https://deimos.cybernode.ai/gaia_lcd/txs/${txHash}`;
    return axios.get(url).then(
      r => r.data,
      e => wrapError(this, e)
    );
  }

  async txStatusCyber(txHash) {
    const url = `${CYBER_NODE_URL_LCD}/txs/${txHash}`;
    return axios.get(url).then(
      r => r.data,
      e => wrapError(this, e)
    );
  }
}

export { CosmosDelegateTool, compareVersion };
