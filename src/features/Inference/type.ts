export type InferenceItem = {
  particle: string;
  balance: number;
  rank: number;
  inference: number;
};

export enum SortBy {
  inference = 'inference',
  rank = 'rank',
  balance = 'balance',
}
