export type ReadyRelease = {
  address: string;
  amount: number;
};

export type CurrentRelease = {
  address: string;
};

export type DataReleaseStatus = {
  availableRelease: number;
  released: number;
  leftRelease: number;
};
