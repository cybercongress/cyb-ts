// eslint-disable-next-line import/prefer-default-export
export const routes = {
  home: {
    path: '/',
  },
  temple: {
    path: '/temple',
  },
  senateProposal: {
    path: '/senate/:proposalId',
    getLink: (proposalId: number) => `/senate/${proposalId}`,
  },
  sphere: {
    path: '/sphere',
  },
  sphereJailed: {
    path: '/sphere/jailed',
  },
  hfr: {
    path: '/hfr',
  },
  gift: {
    path: '/gift',
  },
  ipfs: {
    path: '/ipfs',
    getLink: (param: string) => `/ipfs/${param}`,
  },
  citizenship: {
    path: '/citizenship',
  },
  robot: {
    path: '/robot',
    routes: {
      // TODO: reuse parent
      karma: {
        path: '/robot/karma',
      },
      drive: {
        path: '/robot/drive',
      },
    },
  },
  robotPassport: {
    path: '/:username',
    getLink: (username: string) => `/@${username}`,
  },
  portal: {
    path: '/portal',
  },
  search: {
    path: '/search',
    getLink: (search: string) => `/oracle/ask/${search}`,
  },
  teleport: {
    path: '/teleport',
  },
  keys: {
    path: '/keys',
  },
  sigma: {
    path: '/sigma',
  },
  neuron: {
    path: '/neuron/:address/*',
    getLink: (address: string) => `/neuron/${address}`,
  },
  oracle: {
    path: '/',
    learn: {
      path: '/oracle/learn',
    },
    ask: {
      path: '/oracle/ask/:query',
      getLink: (query: string) => `/oracle/ask/${query}`,
    },
  },
  social: {
    path: '/social',
  },
  brain: {
    path: '/brain',
  },
};
