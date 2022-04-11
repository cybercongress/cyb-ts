const Bech32Address = (prefix) => ({
  bech32PrefixAccAddr: prefix,
  bech32PrefixAccPub: `${prefix}pub`,
  bech32PrefixValAddr: `${prefix}valoper`,
  bech32PrefixValPub: `${prefix}valoperpub`,
  bech32PrefixConsAddr: `${prefix}valcons`,
  bech32PrefixConsPub: `${prefix}valconspub`,
});

const configTerraKeplr = () => ({
  rpc: 'https://rpc-columbus.keplr.app',
  rest: 'https://lcd-columbus.keplr.app',
  chainId: 'columbus-5',
  chainName: 'Terra',
  stakeCurrency: {
    coinDenom: 'LUNA',
    coinMinimalDenom: 'uluna',
    coinDecimals: 6,
    coinGeckoId: 'terra-luna',
    coinImageUrl: `${window.location.origin}/public/assets/tokens/luna.png`,
  },
  bip44: {
    coinType: 330,
  },
  bech32Config: Bech32Address('terra'),
  currencies: [
    {
      coinDenom: 'LUNA',
      coinMinimalDenom: 'uluna',
      coinDecimals: 6,
      coinGeckoId: 'terra-luna',
      coinImageUrl: `${window.location.origin}/public/assets/tokens/luna.png`,
    },
    {
      coinDenom: 'UST',
      coinMinimalDenom: 'uusd',
      coinDecimals: 6,
      coinGeckoId: 'terrausd',
      coinImageUrl: `${window.location.origin}/public/assets/tokens/ust.png`,
    },
    {
      coinDenom: 'KRT',
      coinMinimalDenom: 'ukrw',
      coinDecimals: 6,
      coinGeckoId: 'terra-krw',
      coinImageUrl: `${window.location.origin}/public/assets/tokens/krt.png`,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'LUNA',
      coinMinimalDenom: 'uluna',
      coinDecimals: 6,
      coinGeckoId: 'terra-luna',
      coinImageUrl: `${window.location.origin}/public/assets/tokens/luna.png`,
    },
    {
      coinDenom: 'UST',
      coinMinimalDenom: 'uusd',
      coinDecimals: 6,
      coinGeckoId: 'terrausd',
      coinImageUrl: `${window.location.origin}/public/assets/tokens/ust.png`,
    },
  ],
  gasPriceStep: {
    low: 0.015,
    average: 0.015,
    high: 0.015,
  },
  features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
  explorerUrlToTx: 'https://finder.terra.money/columbus-5/tx/{txHash}',
});

export default configTerraKeplr;
