/* eslint-disable prettier/prettier */
export const abi = [{
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "address"}],
  "name": "claimed",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "name": "previousOwner", "type": "address"}, {
      "indexed": true,
      "name": "newOwner",
      "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}]
