/** ******************************************************************************
 *  (c) 2019 ZondaX GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */
import { COSMOS, CYBER, LEDGER } from './config';

const { DENOM_COSMOS, DEFAULT_GAS, DEFAULT_GAS_PRICE } = COSMOS;
const { DENOM_CYBER } = CYBER;
const { MEMO } = LEDGER;

function canonicalizeJson(jsonTx) {
  if (Array.isArray(jsonTx)) {
    return jsonTx.map(canonicalizeJson);
  }
  if (typeof jsonTx !== 'object') {
    return jsonTx;
  }
  const tmp = {};
  Object.keys(jsonTx)
    .sort()
    .forEach(key => {
      // eslint-disable-next-line no-unused-expressions
      jsonTx[key] != null && (tmp[key] = jsonTx[key]);
    });

  return tmp;
}

function getBytesToSign(tx, txContext) {
  if (typeof txContext === 'undefined') {
    throw new Error('txContext is not defined');
  }
  if (typeof txContext.chainId === 'undefined') {
    throw new Error('txContext does not contain the chainId');
  }
  if (typeof txContext.accountNumber === 'undefined') {
    throw new Error('txContext does not contain the accountNumber');
  }
  if (typeof txContext.sequence === 'undefined') {
    throw new Error('txContext does not contain the sequence value');
  }

  const txFieldsToSign = {
    account_number: txContext.accountNumber.toString(),
    chain_id: txContext.chainId,
    fee: tx.value.fee,
    memo: tx.value.memo,
    msgs: tx.value.msg,
    sequence: txContext.sequence.toString(),
  };

  return JSON.stringify(canonicalizeJson(txFieldsToSign));
}

function applyGas(unsignedTx, gas) {
  if (typeof unsignedTx === 'undefined') {
    throw new Error('undefined unsignedTx');
  }
  if (typeof gas === 'undefined') {
    throw new Error('undefined gas');
  }

  // eslint-disable-next-line no-param-reassign
  unsignedTx.value.fee = {
    amount: [
      {
        amount: (gas * DEFAULT_GAS_PRICE).toString(),
        denom: DENOM_COSMOS,
      },
    ],
    gas: gas.toString(),
  };

  return unsignedTx;
}

function applyGasCyber(unsignedTx, gas) {
  if (typeof unsignedTx === 'undefined') {
    throw new Error('undefined unsignedTx');
  }
  if (typeof gas === 'undefined') {
    throw new Error('undefined gas');
  }

  // eslint-disable-next-line no-param-reassign
  unsignedTx.value.fee = {
    amount: [],
    gas: gas.toString(),
  };

  return unsignedTx;
}

// Creates a new tx skeleton
function createSkeleton(txContext, cli = false) {
  let signatures = null;

  if (!cli) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.accountNumber === 'undefined') {
      throw new Error('txContext does not contain the accountNumber');
    }
    if (typeof txContext.sequence === 'undefined') {
      throw new Error('txContext does not contain the sequence value');
    }

    signatures = [
      {
        signature: 'N/A',
        account_number: txContext.accountNumber.toString(),
        sequence: txContext.sequence.toString(),
        pub_key: {
          type: 'tendermint/PubKeySecp256k1',
          value: 'PK',
        },
      },
    ];
  }

  const txSkeleton = {
    type: 'cosmos-sdk/StdTx',
    value: {
      msg: [], // messages
      fee: '',
      memo: MEMO,
      signatures,
    },
  };
  return applyGas(txSkeleton, DEFAULT_GAS);
}

const createSkeletonCyber = (txContext, cli = false) => {
  let signatures = null;
  if (!cli) {
    if (typeof txContext === 'undefined') {
      throw new Error('undefined txContext');
    }
    if (typeof txContext.accountNumber === 'undefined') {
      throw new Error('txContext does not contain the accountNumber');
    }
    if (typeof txContext.sequence === 'undefined') {
      throw new Error('txContext does not contain the sequence value');
    }
    signatures = [
      {
        signature: 'N/A',
        account_number: txContext.accountNumber.toString(),
        sequence: txContext.sequence.toString(),
        pub_key: {
          type: 'tendermint/PubKeySecp256k1',
          value: 'PK',
        },
      },
    ];
  }

  const txSkeleton = {
    type: 'cosmos-sdk/StdTx',
    value: {
      msg: [], // messages
      fee: '',
      memo: MEMO,
      signatures,
    },
  };
  return applyGasCyber(txSkeleton, DEFAULT_GAS);
};

function applySignature(unsignedTx, txContext, secp256k1Sig) {
  if (typeof unsignedTx === 'undefined') {
    throw new Error('undefined unsignedTx');
  }
  if (typeof txContext === 'undefined') {
    throw new Error('undefined txContext');
  }
  if (typeof txContext.pk === 'undefined') {
    throw new Error('txContext does not contain the public key (pk)');
  }
  if (typeof txContext.accountNumber === 'undefined') {
    throw new Error('txContext does not contain the accountNumber');
  }
  if (typeof txContext.sequence === 'undefined') {
    throw new Error('txContext does not contain the sequence value');
  }

  const tmpCopy = { ...unsignedTx };

  tmpCopy.value.signatures = [
    {
      signature: secp256k1Sig.toString('base64'),
      account_number: txContext.accountNumber.toString(),
      sequence: txContext.sequence.toString(),
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: Buffer.from(txContext.pk, 'hex').toString('base64'),
      },
    },
  ];
  return tmpCopy;
}

// Creates a new delegation tx based on the input parameters
// the function expects a complete txContext
function createDelegate(txContext, validatorBech32, uatomAmount, memo) {
  const txSkeleton = createSkeleton(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgDelegate',
    value: {
      amount: {
        amount: uatomAmount.toString(),
        denom: DENOM_COSMOS,
      },
      delegator_address: txContext.bech32,
      validator_address: validatorBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createDelegateCyber(txContext, validatorBech32, uAmount, memo, denom) {
  const txSkeleton = createSkeletonCyber(txContext, denom);

  const txMsg = {
    type: 'cosmos-sdk/MsgDelegate',
    value: {
      amount: {
        amount: uAmount.toString(),
        denom,
      },
      delegator_address: txContext.bech32,
      validator_address: validatorBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createSend(txContext, toAddress, uatomAmount, memo, cli, addressFrom) {
  const txSkeleton = createSkeleton(txContext, cli);

  let fromAddress = '';

  if (txContext !== null && !cli) {
    fromAddress = txContext.bech32;
  } else {
    fromAddress = addressFrom;
  }

  const txMsg = {
    type: 'cosmos-sdk/MsgSend',
    value: {
      amount: [
        {
          amount: uatomAmount.toString(),
          denom: DENOM_COSMOS,
        },
      ],
      from_address: fromAddress,
      to_address: toAddress,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createSendCyber(txContext, validatorBech32, uatomAmount, memo, denom) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgSend',
    value: {
      amount: [
        {
          amount: uatomAmount.toString(),
          denom,
        },
      ],
      from_address: txContext.bech32,
      to_address: validatorBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createLink(txContext, address, fromCid, toCid, memo) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cyber/Link',
    value: {
      address,
      links: [
        {
          from: fromCid,
          to: toCid,
        },
      ],
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createTextProposal(
  txContext,
  address,
  title,
  description,
  deposit,
  memo
) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgSubmitProposal',
    value: {
      content: {
        type: 'cosmos-sdk/TextProposal',
        value: {
          description,
          title,
        },
      },
      initial_deposit: deposit,
      proposer: address,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function sendDeposit(txContext, proposalId, depositor, deposit, memo, cli) {
  const txSkeleton = createSkeletonCyber(txContext, cli);

  const txMsg = {
    type: 'cosmos-sdk/MsgDeposit',
    value: {
      amount: deposit,
      depositor,
      proposal_id: proposalId,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function voteProposal(txContext, proposalId, voter, option, memo, cli) {
  const txSkeleton = createSkeletonCyber(txContext, cli);

  const txMsg = {
    type: 'cosmos-sdk/MsgVote',
    value: {
      option,
      proposal_id: proposalId,
      voter,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createCommunityPool(
  txContext,
  address,
  title,
  description,
  recipient,
  deposit,
  amount,
  memo
) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgSubmitProposal',
    value: {
      content: {
        type: 'cosmos-sdk/CommunityPoolSpendProposal',
        value: {
          amount,
          description,
          recipient,
          title,
        },
      },
      initial_deposit: deposit,
      proposer: address,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

// Creates a new undelegation tx based on the input parameters
// the function expects a complete txContext
function createUndelegate(txContext, validatorBech32, uatomAmount, memo) {
  const txSkeleton = createSkeleton(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgUndelegate',
    value: {
      amount: {
        amount: uatomAmount.toString(),
        denom: DENOM_COSMOS,
      },
      delegator_address: txContext.bech32,
      validator_address: validatorBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createUndelegateCyber(txContext, validatorBech32, eulAmount, memo) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgUndelegate',
    value: {
      amount: {
        amount: eulAmount.toString(),
        denom: DENOM_CYBER,
      },
      delegator_address: txContext.bech32,
      validator_address: validatorBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

// Creates a new redelegation tx based on the input parameters
// the function expects a complete txContext
function createRedelegate(
  txContext,
  validatorSourceBech32,
  validatorDestBech32,
  uatomAmount,
  memo
) {
  const txSkeleton = createSkeleton(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgBeginRedelegate',
    value: {
      amount: {
        amount: uatomAmount.toString(),
        denom: DENOM_COSMOS,
      },
      delegator_address: txContext.bech32,
      validator_dst_address: validatorDestBech32,
      validator_src_address: validatorSourceBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createWithdrawDelegationReward(txContext, address, memo, rewards) {
  const txSkeleton = createSkeletonCyber(txContext);
  txSkeleton.value.msg = [];

  Object.keys(rewards).forEach(key => {
    txSkeleton.value.msg.push({
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: address,
        validator_address: rewards[key].validator_address,
      },
    });
  });

  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createRedelegateCyber(
  txContext,
  validatorSourceBech32,
  validatorDestBech32,
  uatomAmount,
  memo
) {
  const txSkeleton = createSkeletonCyber(txContext);

  const txMsg = {
    type: 'cosmos-sdk/MsgBeginRedelegate',
    value: {
      amount: {
        amount: uatomAmount.toString(),
        denom: DENOM_CYBER,
      },
      delegator_address: txContext.bech32,
      validator_dst_address: validatorDestBech32,
      validator_src_address: validatorSourceBech32,
    },
  };

  txSkeleton.value.msg = [txMsg];
  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

function createImportLink(txContext, address, links, memo, cli) {
  const txSkeleton = createSkeletonCyber(txContext, cli);
  txSkeleton.value.msg = [];

  Object.keys(links).forEach(key => {
    txSkeleton.value.msg.push({
      type: 'cyber/Link',
      value: {
        address,
        links: [
          {
            from: links[key].from,
            to: links[key].to,
          },
        ],
      },
    });
  });

  txSkeleton.value.memo = memo || '';

  return txSkeleton;
}

export default {
  createSkeleton,
  createDelegate,
  createRedelegate,
  createUndelegate,
  getBytesToSign,
  applySignature,
  createSend,
  createLink,
  createSendCyber,
  createDelegateCyber,
  createTextProposal,
  createCommunityPool,
  createUndelegateCyber,
  createWithdrawDelegationReward,
  createRedelegateCyber,
  createImportLink,
  voteProposal,
  sendDeposit,
};
