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
  "constant": true,
  "inputs": [],
  "name": "time",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "day", "type": "uint256"}],
  "name": "claim",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "address"}],
  "name": "userBuys",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "day", "type": "uint256"}],
  "name": "createOnDay",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "freeze",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "address"}],
  "name": "keys",
  "outputs": [{"name": "", "type": "string"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "startTime",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "dailyTotals",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "initialize",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "owner",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "isOwner",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "buy",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "openTime",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "today",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "createFirstDay",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "claimAll",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "timestamp", "type": "uint256"}],
  "name": "dayFor",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "day", "type": "uint256"}, {"name": "limit", "type": "uint256"}],
  "name": "buyWithLimit",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "collect",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "numberOfDays",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "newOwner", "type": "address"}],
  "name": "transferOwnership",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "createPerDay",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "token",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"name": "_numberOfDays", "type": "uint256"}, {
      "name": "_openTime",
      "type": "uint256"
  }, {"name": "_startTime", "type": "uint256"}, {"name": "_token", "type": "address"}],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "name": "window", "type": "uint256"}, {
      "indexed": false,
      "name": "user",
      "type": "address"
  }, {"indexed": false, "name": "amount", "type": "uint256"}],
  "name": "LogBuy",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "name": "window", "type": "uint256"}, {
      "indexed": false,
      "name": "user",
      "type": "address"
  }, {"indexed": false, "name": "amount", "type": "uint256"}],
  "name": "LogClaim",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
  "name": "LogCollect",
  "type": "event"
}, {"anonymous": false, "inputs": [], "name": "LogFreeze", "type": "event"}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
  "name": "LogPrice",
  "type": "event"
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