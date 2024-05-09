const root = '/cybernet';

export const routes = {
  subnets: {
    path: `${root}/subnets`,
    getLink: () => `${root}/subnets`,
  },
  subnet: {
    path: `${root}/subnets/:id`,
    getLink: (id: string | number) => `${root}/subnets/${id}`,
  },
  delegators: {
    path: `${root}/delegators`,
    getLink: () => `${root}/delegators`,
  },
  delegator: {
    path: `${root}/delegators/:address`,
    getLink: (address: string) => `${root}/delegators/${address}`,
  },
};

export const cybernetRoutes = routes;
