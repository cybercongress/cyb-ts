const coinDecimalsConfig = {
  'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B': {
    chainId: 'osmosis-1',
    coinDecimals: 6,
    denom: 'OSMO',
    coinMinimalDenom: 'uosmo',
    rpc: 'https://rpc-osmosis.blockapsis.com/',
    prefix: 'osmo',
    sourceChannelId: 'channel-95',
    destChannelId: 'channel-2',
  },
  'ibc/15E9C5CF5969080539DB395FA7D9C0868265217EFC528433671AAF9B1912D159': {
    chainId: 'cosmoshub-4',
    coinDecimals: 6,
    denom: 'ATOM',
    coinMinimalDenom: 'uatom',
    rpc: 'https://rpc.cosmoshub-4.cybernode.ai/',
    prefix: 'cosmos',
    sourceChannelId: 'channel-341',
    destChannelId: 'channel-8',
  },
  pool70D7610CBA8E94B27BAD7806EBD826F5626C486BBF5C490D1463D72314353C66: {
    denom: ['boot', 'hydrogen'],
  },
  pool27BBCA67F42ED27DFFB6A450966C7EA206ADAA42BA0A1871FADC6C59569F6E8D: {
    denom: ['boot', 'milliampere'],
  },
  pool5D83035BE0E7AB904379161D3C52FB4C1C392265AC19CE39A864146198610628: {
    denom: ['boot', 'tocyb'],
  },
  poolB02CE42B202A71419D2F9EB4996B36C52F1B5B60DAF7D7B1474660A95656C126: {
    denom: ['hydrogen', 'tocyb'],
  },
  pool79B9E8E233B61B84EA5AE564AB080FC492B4C953A9D8B409F300D9E29716459F: {
    denom: ['hydrogen', 'milliampere'],
  },
  poolE479A51F998E2979F89DA9AB897ED45A9AFE4E7DE32BE3D30FB456E58F80D4E9: {
    denom: ['hydrogen', 'millivolt'],
  },
  pool98692450C039BDD30563475A7699A7805075F592A36837A04357F20B0D59C90F: {
    denom: [
      'hydrogen',
      'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
    ],
  },
  poolDA191D1EBA3F4074C2CAB12777FC388216EED222F570548DC3C7D3848D5BE37E: {
    denom: [
      'hydrogen',
      'ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA',
    ],
  },
  pool590D4E176871842968705C246DA60E0A57EA41F9257CC7125C8C137C157CC5FA: {
    denom: [
      'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
      'ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA',
    ],
  },
  pool906F3CC4C0F4634031990DB81761BD390890F8A8A80460EBDC6B151254DE7D1D: {
    denom: ['milliampere', 'millivolt'],
  },
  pool1A492174015ABA47066C8569AFF7582C551980840AAE7EBAEFB667347EDDB601: {
    denom: ['boot', 'millivolt'],
  },
  pool5D5734E54F485FBAF21DF886EC396F2CBC72203BF050BDE0F99EB94EA37D39E8: {
    denom: [
      'hydrogen',
      'ibc/15E9C5CF5969080539DB395FA7D9C0868265217EFC528433671AAF9B1912D159',
    ],
  },
  milliampere: {
    coinDecimals: 3,
    denom: 'A',
    coinMinimalDenom: 'milliampere',
  },
  hydrogen: {
    coinDecimals: 0,
    denom: 'H',
    coinMinimalDenom: 'hydrogen',
  },
  liquidpussy: {
    coinDecimals: 0,
    denom: 'LP',
    coinMinimalDenom: 'liquidpussy',
  },
  millivolt: {
    coinDecimals: 3,
    denom: 'V',
    coinMinimalDenom: 'millivolt',
  },
  uosmo: {
    coinDecimals: 6,
  },
  uatom: {
    coinDecimals: 6,
  },
};

export default coinDecimalsConfig;
