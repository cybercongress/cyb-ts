export type ReadyRelease = {
  address: string;
  amount: number;
};

export type CurrentRelease = {
  address: string;
  addressOwner: string;
};

export type DataReleaseStatus = {
  availableRelease: number;
  released: number;
  leftRelease: number;
};
