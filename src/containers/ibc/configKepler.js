const configKeplr = (option) => {
  return {
    // Chain-id of the Cosmos SDK chain.
    chainId: option.chainId,
    // The name of the chain to be displayed to the user.
    chainName: option.chainId,
    // RPC endpoint of the chain.
    rpc: option.rpcEndpoint,
    rest: option.restEndpoint,
    stakeCurrency: {
      coinDenom: option.denom.toUpperCase(),
      coinMinimalDenom: option.denom,
      coinDecimals: 0,
    },
    bip44: {
      // You can only set the coin type of BIP44.
      // 'Purpose' is fixed to 44.
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: option.addrPrefix,
      bech32PrefixAccPub: `${option.addrPrefix}pub`,
      bech32PrefixValAddr: `${option.addrPrefix}valoper`,
      bech32PrefixValPub: `${option.addrPrefix}valoperpub`,
      bech32PrefixConsAddr: `${option.addrPrefix}valcons`,
      bech32PrefixConsPub: `${option.addrPrefix}valconspub`,
    },
    currencies: [
      {
        coinDenom: option.denom.toUpperCase(),
        coinMinimalDenom: option.denom,
        coinDecimals: 0,
      },
      {
        coinDenom: 'H',
        coinMinimalDenom: 'hydrogen',
        coinDecimals: 0,
      },
      {
        coinDenom: 'V',
        coinMinimalDenom: 'millivolt',
        coinDecimals: 3,
      },
      {
        coinDenom: 'A',
        coinMinimalDenom: 'milliampere',
        coinDecimals: 3,
      },
    ],
    // List of coin/tokens used as a fee token in this chain.
    feeCurrencies: [
      {
        // Coin denomination to be displayed to the user.
        coinDenom: option.denom.toUpperCase(),
        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
        coinMinimalDenom: option.denom,
        // # of decimal points to convert minimal denomination to user-facing denomination.
        coinDecimals: 0,
      },
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0.001,
      average: 0.01,
      high: 0.025,
    },
    features: ['stargate', 'ibc-transfer'],
  };
};

export { configKeplr };
