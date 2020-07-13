const abiEvangelism = [
  {
    constant: true,
    inputs: [],
    name: 'hasInitialized',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_script',
        type: 'bytes',
      },
    ],
    name: 'getEVMScriptExecutor',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getRecoveryVault',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'foundation',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    name: 'allowRecoverability',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'appId',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getInitializationBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
    ],
    name: 'transferToVault',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_sender',
        type: 'address',
      },
      {
        name: '_role',
        type: 'bytes32',
      },
      {
        name: '_params',
        type: 'uint256[]',
      },
    ],
    name: 'canPerform',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getEVMScriptRegistry',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'evangelists',
    outputs: [
      {
        name: 'cyberAddress',
        type: 'string',
      },
      {
        name: 'cosmosAddress',
        type: 'string',
      },
      {
        name: 'ethereumAddress',
        type: 'address',
      },
      {
        name: 'nickname',
        type: 'string',
      },
      {
        name: 'keybase',
        type: 'string',
      },
      {
        name: 'github',
        type: 'string',
      },
      {
        name: 'status',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'FOUNDER_ROLE',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kernel',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isPetrified',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'cyberAddress',
        type: 'string',
      },
      {
        indexed: false,
        name: 'cosmosAddress',
        type: 'string',
      },
      {
        indexed: false,
        name: 'ethereumAddress',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nickname',
        type: 'string',
      },
      {
        indexed: false,
        name: 'keybase',
        type: 'string',
      },
      {
        indexed: false,
        name: 'github',
        type: 'string',
      },
    ],
    name: 'Believed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'nickname',
        type: 'string',
      },
    ],
    name: 'Blessed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'nickname',
        type: 'string',
      },
    ],
    name: 'Unblessed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'executor',
        type: 'address',
      },
      {
        indexed: false,
        name: 'script',
        type: 'bytes',
      },
      {
        indexed: false,
        name: 'input',
        type: 'bytes',
      },
      {
        indexed: false,
        name: 'returnData',
        type: 'bytes',
      },
    ],
    name: 'ScriptResult',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'vault',
        type: 'address',
      },
      {
        indexed: true,
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RecoverToVault',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_foundation',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_cyberAddress',
        type: 'string',
      },
      {
        name: '_cosmosAddress',
        type: 'string',
      },
      {
        name: '_nickname',
        type: 'string',
      },
      {
        name: '_keybase',
        type: 'string',
      },
      {
        name: '_github',
        type: 'string',
      },
    ],
    name: 'believe',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_nickname',
        type: 'string',
      },
    ],
    name: 'bless',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_nickname',
        type: 'string',
      },
    ],
    name: 'unbless',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'collect',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default abiEvangelism;
