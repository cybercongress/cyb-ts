const root = '/cyberverse';

export const routes = {
  verses: {
    path: `${root}/verses`,
    getLink: () => `${root}/verses`,
  },
  verseNetwork: {
    path: `${root}/verses/:network`,
    getLink: (network: string) => `${root}/verse/${network}`,
  },
  verse: {
    path: `${root}/verses/:network/:nameOrAddress`,
    getLink: (network: string, nameOrAddress: string) =>
      `${root}/verses/${network}/${nameOrAddress}`,
  },
  subnets: {
    path: `${root}/verses/:network/:nameOrAddress/facilities`,
    getLink: (network: string, nameOrAddress: string) =>
      `${root}/verses/${network}/${nameOrAddress}/facilities`,
  },
  subnet: {
    path: `${root}/verses/:network/:nameOrAddress/facilities/:nameOrUid`,
    getLink: (
      network: string,
      nameOrAddress: string,
      nameOrUid: string | number
    ) => `${root}/verses/${network}/${nameOrAddress}/facilities/${nameOrUid}`,
  },
  delegators: {
    path: `${root}/verses/:network/:nameOrAddress/facilities/:nameOrUid/mentors`,
    getLink: (network: string, nameOrAddress: string, nameOrUid: string) =>
      `${root}/verses/${network}/${nameOrAddress}/mentors`,
  },
  delegator: {
    path: `${root}/verses/:network/:nameOrAddress/facilities/:nameOrUid/mentors/:address`,
    getLink: (network: string, nameOrAddress: string, address: string) =>
      `${root}/verses/${network}/${nameOrAddress}/mentors/${address}`,
  },
  myLearner: {
    path: `${root}/verses/:network/:nameOrAddress/learners/my`,
    getLink: (network: string, nameOrAddress: string) =>
      `${root}/verses/${network}/${nameOrAddress}/learners/my`,
  },
};

routes.delegate = routes.delegator;

export const cybernetRoutes = routes;
