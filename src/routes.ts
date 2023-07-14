// eslint-disable-next-line import/prefer-default-export
export const routes = {
  home: {
    path: '/',
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
  },
  citizenship: {
    path: '/citizenship',
  },
  robot: {
    path: '/robot',
    routes: {
      karma: {
        // TODO: reuse parent
        path: '/robot/karma',
      },
      drive: {
        // TODO: reuse parent
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
    getLink: (search: string) => `/search/${search}`,
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
};
