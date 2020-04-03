const abiAuctionUtils = [
  {
    constant: true,
    inputs: [{ name: 'user', type: 'address' }],
    name: 'userBuys',
    outputs: [{ name: 'result', type: 'uint256[21]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'sale',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'dailyTotals',
    outputs: [{ name: 'result', type: 'uint256[21]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'user', type: 'address' }],
    name: 'userClaims',
    outputs: [{ name: 'result', type: 'bool[21]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_sale', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];

export default abiAuctionUtils;
