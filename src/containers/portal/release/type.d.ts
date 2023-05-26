export type ReadyRelease = {
  address: string;
  amount: number;
  addressOwner: string;
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
