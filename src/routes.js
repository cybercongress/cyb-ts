// eslint-disable-next-line import/prefer-default-export
export const routes = {
  home: {
    path: '/',
  },
  senateProposal: {
    path: '/senate/:proposalId',
    getLink: (proposalId) => `/senate/${proposalId}`,
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
  },
};
